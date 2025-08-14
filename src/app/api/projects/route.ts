import { mockProjects } from '@mockApi/project'
import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json(mockProjects)
}
