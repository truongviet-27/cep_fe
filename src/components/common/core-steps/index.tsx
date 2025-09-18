import { Steps } from 'antd'
import type { ReactNode } from 'react'
import React from 'react'

function CoreStep({
  size = 'default',
  currentStep,
  labelPlacement = 'vertical',
  steps,
  onChange,
}: {
  currentStep: number
  steps: { title: string; content: string | ReactNode }[]
  onChange: (step: number) => void
  size?: 'default' | 'small'
  labelPlacement?: 'vertical'
}) {
  return (
    <>
      <Steps
        size={size}
        current={currentStep}
        labelPlacement={labelPlacement}
        items={steps.map((item) => ({ title: item.title }))}
        onChange={onChange}
        className="!mx-auto !my-4 !max-w-[1000px]"
      />
      <div>{steps[currentStep].content}</div>
    </>
  )
}

export default CoreStep
