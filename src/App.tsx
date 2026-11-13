import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { Discover } from './views/Discover'
import { DestinationDetail } from './views/DestinationDetail'
import { MyUnlocks } from './views/MyUnlocks'
import { About } from './views/About'
import { NotFound } from './views/NotFound'

const base = import.meta.env.BASE_URL.replace(/\/$/, '') || '/'

export default function App() {
  return (
    <BrowserRouter basename={base}>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Discover />} />
          <Route path="destination/:id" element={<DestinationDetail />} />
          <Route path="unlocks" element={<MyUnlocks />} />
          <Route path="about" element={<About />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
