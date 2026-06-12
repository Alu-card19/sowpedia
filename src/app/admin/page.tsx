'use client'

import { useEffect, useState } from 'react'
import AdminPasswordModal from '@/components/AdminPasswordModal'
import AdminTabs from '@/components/AdminTabs'
import ContestantsTab from '@/components/ContestantsTab'
import SponsorsTab from '@/components/SponsorsTab'
import LiveScoreBoard from '@/components/LiveScoreBoard'
import { supabase } from '@/lib/supabase'
import { Contestant, Section, Sponsor } from '@/lib/types'
import styles from './page.module.css'

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [activeTab, setActiveTab] = useState('Contestants')
  const [sections, setSections] = useState<Section[]>([])
  const [contestants, setContestants] = useState<Contestant[]>([])
  const [sponsors, setSponsors] = useState<Sponsor[]>([])
  const [activeSection, setActiveSection] = useState<string | null>(null)

  useEffect(() => {
    if (typeof window !== 'undefined' && sessionStorage.getItem('adminAuth') === 'true') {
      setIsAuthenticated(true)
    }
  }, [])

  useEffect(() => {
    if (!isAuthenticated) return

    const fetchData = async () => {
      try {
        const { data: sectionsData } = await supabase
          .from('sections')
          .select('*')
          .order('order_index')

        setSections(sectionsData || [])
        if (sectionsData && sectionsData.length > 0) {
          setActiveSection(sectionsData[0].name)
        }

        const { data: contestantsData } = await supabase
          .from('contestants')
          .select('*')

        setContestants(contestantsData || [])

        const { data: sponsorsData } = await supabase
          .from('sponsors')
          .select('*')
          .order('order_index')

        setSponsors(sponsorsData || [])
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchData()

    // Subscribe to realtime updates for contestants
    const channel = supabase
      .channel('admin-contestants-updates')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'contestants' },
        (payload) => {
          console.log('Contestant update received:', payload)
          
          if (payload.eventType === 'UPDATE') {
            const updatedContestant = payload.new as Contestant
            setContestants((prev) =>
              prev.map((c) => (c.id === updatedContestant.id ? updatedContestant : c))
            )
          } else if (payload.eventType === 'INSERT') {
            const newContestant = payload.new as Contestant
            setContestants((prev) => [...prev, newContestant])
          } else if (payload.eventType === 'DELETE') {
            const deletedId = (payload.old as Contestant).id
            setContestants((prev) => prev.filter((c) => c.id !== deletedId))
          }
        }
      )
      .subscribe()

    // Subscribe to sponsors updates
    const sponsorChannel = supabase
      .channel('admin-sponsors-updates')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'sponsors' },
        (payload) => {
          console.log('Sponsor update received:', payload)
          
          if (payload.eventType === 'UPDATE') {
            const updatedSponsor = payload.new as Sponsor
            setSponsors((prev) =>
              prev.map((s) => (s.id === updatedSponsor.id ? updatedSponsor : s)).sort((a, b) => a.order_index - b.order_index)
            )
          } else if (payload.eventType === 'INSERT') {
            const newSponsor = payload.new as Sponsor
            setSponsors((prev) => [...prev, newSponsor].sort((a, b) => a.order_index - b.order_index))
          } else if (payload.eventType === 'DELETE') {
            const deletedId = (payload.old as Sponsor).id
            setSponsors((prev) => prev.filter((s) => s.id !== deletedId))
          }
        }
      )
      .subscribe()

    return () => {
      channel.unsubscribe()
      sponsorChannel.unsubscribe()
    }
  }, [isAuthenticated])

  if (!isAuthenticated) {
    return <AdminPasswordModal onSuccess={() => setIsAuthenticated(true)} />
  }

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.header}>
          <h1 className={styles.title}>Admin Panel</h1>
          <p className={styles.subtitle}>Spelling Bee Championship Management</p>
        </div>

        <AdminTabs activeTab={activeTab} onTabChange={setActiveTab} />

        {activeTab === 'Contestants' && (
          <ContestantsTab
            contestants={contestants}
            sections={sections}
            onRefresh={() => {}}
          />
        )}

        {activeTab === 'Sponsors' && (
          <SponsorsTab sponsors={sponsors} onRefresh={() => {}} />
        )}

        {activeTab === 'Live Board' && (
          <LiveScoreBoard
            contestants={contestants}
            sections={sections}
            activeSection={activeSection}
            onSectionChange={setActiveSection}
          />
        )}
      </div>
    </div>
  )
}
