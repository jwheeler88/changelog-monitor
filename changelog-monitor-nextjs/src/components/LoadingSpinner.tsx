const LoadingSpinner = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex flex-col items-center justify-center py-16">
      <div className="relative">
        <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin"></div>
      </div>
      <p className="mt-4 text-gray-600 text-lg">
        Loading Claude Code updates...
      </p>
    </div>
  )
}

export default LoadingSpinner