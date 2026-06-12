'use client'

import { useEffect, useState } from 'react'
import HeroSection from '@/components/HeroSection'
import SectionTabs from '@/components/SectionTabs'
import ContestantGrid from '@/components/ContestantGrid'
import LiveLeaderboard from '@/components/LiveLeaderboard'
import SponsorBar from '@/components/SponsorBar'
import VideoModal from '@/components/VideoModal'
import { supabase } from '@/lib/supabase'
import { Contestant, Section, Sponsor } from '@/lib/types'

export default function Home() {
  const [sections, setSections] = useState<Section[]>([])
  const [contestants, setContestants] = useState<Contestant[]>([])
  const [sponsors, setSponsors] = useState<Sponsor[]>([])
  const [activeSection, setActiveSection] = useState<string | null>(null)
  const [selectedContestant, setSelectedContestant] = useState<Contestant | null>(null)
  const [updatedContestantId, setUpdatedContestantId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch sections
        const { data: sectionsData, error: sectionsError } = await supabase
          .from('sections')
          .select('*')
          .order('order_index')

        if (sectionsError) throw sectionsError
        setSections(sectionsData || [])

        // Set first section as active
        if (sectionsData && sectionsData.length > 0) {
          setActiveSection(sectionsData[0].name)
        }

        // Fetch contestants
        const { data: contestantsData, error: contestantsError } = await supabase
          .from('contestants')
          .select('*')

        if (contestantsError) throw contestantsError
        setContestants(contestantsData || [])

        // Fetch sponsors
        const { data: sponsorsData, error: sponsorsError } = await supabase
          .from('sponsors')
          .select('*')
          .order('order_index')

        if (sponsorsError) throw sponsorsError
        setSponsors(sponsorsData || [])
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Subscribe to realtime updates
  useEffect(() => {
    const channel = supabase
      .channel('contestants-updates')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'contestants' },
        (payload) => {
          const updatedContestant = payload.new as Contestant

          // Update local state
          setContestants((prev) =>
            prev.map((c) => (c.id === updatedContestant.id ? updatedContestant : c))
          )

          // Set flash animation
          setUpdatedContestantId(updatedContestant.id)
          setTimeout(() => setUpdatedContestantId(null), 600)

          // Update last score update time for LIVE badge
          localStorage.setItem('lastScoreUpdate', Date.now().toString())
        }
      )
      .subscribe()

    return () => {
      channel.unsubscribe()
    }
  }, [])

  if (loading) {
    return (
      <div style={{ background: '#090d26', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: '#FFD700', fontFamily: 'Bebas Neue, sans-serif', fontSize: '24px' }}>
          Loading...
        </div>
      </div>
    )
  }

  return (
    <>
      <HeroSection />
      <SectionTabs
        sections={sections}
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />
      <ContestantGrid
        contestants={contestants}
        activeSection={activeSection}
        onWatchClick={setSelectedContestant}
        updatedContestantId={updatedContestantId}
      />
      <LiveLeaderboard
        contestants={contestants}
        activeSection={activeSection}
      />
      <SponsorBar sponsors={sponsors} />
      <VideoModal
        contestant={selectedContestant}
        onClose={() => setSelectedContestant(null)}
      />
    </>
  )
}
