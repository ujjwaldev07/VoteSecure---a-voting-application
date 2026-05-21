import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Search, SlidersHorizontal } from 'lucide-react'
import { PageTransition } from '@/components/shared/page-transition'
import { CandidateCard } from '@/components/voting/candidate-card'
import { VoteModal } from '@/components/voting/vote-modal'
import { Input } from '@/components/ui/input'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Skeleton } from '@/components/ui/skeleton'
import { EmptyState } from '@/components/shared/empty-state'
import { useCandidates } from '@/hooks/use-candidates'
import { useDebounce } from '@/hooks/use-debounce'
import { useAuthStore } from '@/store/auth-store'
import { useProfile } from '@/hooks/use-profile'
import { PARTY_CATEGORIES } from '@/lib/constants'
import type { Candidate } from '@/types'
import { Users } from 'lucide-react'

type SortKey = 'name' | 'votes' | 'party'

export default function CandidatesPage() {
  const [search, setSearch] = useState('')
  const [party, setParty] = useState('All')
  const [sort, setSort] = useState<SortKey>('votes')
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState<Candidate | null>(null)
  const debouncedSearch = useDebounce(search)
  const { data: candidates = [], isLoading, refetch } = useCandidates()
  const user = useAuthStore((s) => s.user)
  useProfile()

  const perPage = 6
  const totalVotes = candidates.reduce((s, c) => s + c.voteCount, 0)

  const filtered = useMemo(() => {
    let list = [...candidates]
    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase()
      list = list.filter(
        (c) => c.name.toLowerCase().includes(q) || c.party.toLowerCase().includes(q)
      )
    }
    if (party !== 'All') {
      list = list.filter((c) => c.party.toLowerCase().includes(party.toLowerCase()))
    }
    list.sort((a, b) => {
      if (sort === 'name') return a.name.localeCompare(b.name)
      if (sort === 'party') return a.party.localeCompare(b.party)
      return b.voteCount - a.voteCount
    })
    return list
  }, [candidates, debouncedSearch, party, sort])

  const paginated = filtered.slice((page - 1) * perPage, page * perPage)
  const totalPages = Math.ceil(filtered.length / perPage) || 1

  return (
    <PageTransition>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Candidates</h1>
        <p className="text-muted-foreground">Browse and cast your vote for your preferred candidate</p>
      </div>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search candidates..."
            className="pl-9"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1)
            }}
          />
        </div>
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
          <select
            className="rounded-lg border border-input bg-background px-3 py-2 text-sm"
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            aria-label="Sort candidates"
          >
            <option value="votes">Most votes</option>
            <option value="name">Name</option>
            <option value="party">Party</option>
          </select>
        </div>
      </div>

      <Tabs value={party} onValueChange={(v) => { setParty(v); setPage(1) }} className="mb-6">
        <TabsList className="flex-wrap h-auto">
          {PARTY_CATEGORIES.map((p) => (
            <TabsTrigger key={p} value={p}>
              {p}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {isLoading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-72 rounded-xl" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No candidates found"
          description="Try adjusting your search or filters."
        />
      ) : (
        <>
          <motion.div
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.06 } } }}
          >
            {paginated.map((c) => (
              <motion.div
                key={c._id}
                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
              >
                <CandidateCard
                  candidate={c}
                  votePercent={totalVotes ? (c.voteCount / totalVotes) * 100 : 0}
                  onVote={() => setSelected(c)}
                  hasVoted={!!user?.isVoted}
                  isAdmin={user?.role === 'admin'}
                />
              </motion.div>
            ))}
          </motion.div>

          {totalPages > 1 && (
            <div className="mt-8 flex justify-center gap-2">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`h-9 w-9 rounded-lg text-sm font-medium transition-colors ${
                    page === i + 1 ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-accent'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </>
      )}

      <VoteModal
        candidate={selected}
        open={!!selected}
        onClose={() => setSelected(null)}
        onSuccess={() => void refetch()}
      />
    </PageTransition>
  )
}
