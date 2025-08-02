const LoadingSpinner = () => {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="relative">
        <div className="w-12 h-12 border-4 border-claude-cream border-t-claude-orange rounded-full animate-spin"></div>
      </div>
      <p className="mt-4 text-claude-text font-claude text-lg">
        Loading Claude Code updates...
      </p>
    </div>
  )
}

export default LoadingSpinner