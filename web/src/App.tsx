import Editor from './components/Editor'
import Terminal from './components/Terminal'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from './components/ui/resizable'

function App() {
  return (
    <div className='h-screen w-screen'>
      <ResizablePanelGroup direction='vertical'>

        <ResizablePanel defaultSize={80} minSize={20}>
          <div className='relative size-full'>
            <Editor className='size-full' />
          </div>
        </ResizablePanel>

        <ResizableHandle withHandle />

        <ResizablePanel>
          <Terminal className='size-full bg-amber-950' />
        </ResizablePanel>

      </ResizablePanelGroup>
    </div >
  )
}

export default App
