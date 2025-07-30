import React from 'react'

function CommonCard({ children }: Readonly<React.PropsWithChildren>) {
  return (
    <div className="min-h-[82vh] rounded-lg bg-white p-6 shadow-sm">
      {children}
    </div>
  )
}

export default CommonCard
