import Editor from './components/Editor'
import Terminal from './components/Terminal'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from './components/ui/resizable'


function FileTree() {
  return (<div className='flex flex-col bg-amber-600'>File tree</div>)
}

function App() {
  return (
    <div className='h-screen w-screen'>
      <ResizablePanelGroup direction="horizontal" className="h-screen w-screen">
        <ResizablePanel defaultSize={20} minSize={10} maxSize={30}>
          <FileTree />
        </ResizablePanel>

        <ResizableHandle />

        <ResizablePanel defaultSize={80}>
          <ResizablePanelGroup direction='vertical'>

            <ResizablePanel defaultSize={80} minSize={20}>
              <Editor className='size-full' />
            </ResizablePanel>

            <ResizableHandle />

            <ResizablePanel>
              <Terminal className='size-full' />
            </ResizablePanel>

          </ResizablePanelGroup>
        </ResizablePanel>


      </ResizablePanelGroup>
    </div>
  )
}

export default App
