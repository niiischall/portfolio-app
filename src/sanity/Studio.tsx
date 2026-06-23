import {Studio} from 'sanity'
import config from '../../sanity.config'

export default function StudioPage() {
  return (
    <div style={{height: '100vh', overflow: 'hidden'}}>
      <Studio config={config} />
    </div>
  )
}
