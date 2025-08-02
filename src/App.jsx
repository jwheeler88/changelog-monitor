import ChangelogFeed from './components/ChangelogFeed'

function App() {
  return (
    <div className="min-h-screen bg-claude-gradient">
      {/* Background pattern overlay */}
      <div className="absolute inset-0 opacity-5">
        <div className="h-full w-full bg-[radial-gradient(circle_at_1px_1px,rgba(218,119,86,0.15)_1px,transparent_0)] bg-[length:20px_20px]"></div>
      </div>
      
      {/* Main content */}
      <div className="relative z-10">
        <ChangelogFeed />
      </div>
    </div>
  )
}

export default App