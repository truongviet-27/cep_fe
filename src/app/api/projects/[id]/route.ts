import { type NextRequest, NextResponse } from 'next/server'

import { mockProjects } from '@/lib/mockData'

const projects = [...mockProjects]

export async function GET(
  request: NextRequest,
  { params }: { params: { id: number } },
) {
  try {
    const { id } = params

    if (!id) {
      return NextResponse.json({ error: 'Invalid project id' }, { status: 400 })
    }

    const project = projects.find((p) => p.id == id)

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    return NextResponse.json(project)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch project' },
      { status: 500 },
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: number } },
) {
  try {
    const { id } = params
    const body = await request.json()

    if (!id) {
      return NextResponse.json({ error: 'Invalid project id' }, { status: 400 })
    }

    const projectIndex = projects.findIndex((p) => p.id == id)

    if (projectIndex === -1) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    // Check if project code already exists (excluding current project)
    if (
      body.projectCode &&
      projects.some(
        (project, index) =>
          project.projectCode === body.projectCode && index !== projectIndex,
      )
    ) {
      return NextResponse.json(
        { error: 'Project code already exists' },
        { status: 409 },
      )
    }

    // Update the updatedDate
    const currentDate = new Date()
    const formattedDate = `${currentDate.getFullYear()}/${String(currentDate.getMonth() + 1).padStart(2, '0')}/${String(currentDate.getDate()).padStart(2, '0')}`

    projects[projectIndex] = {
      ...projects[projectIndex],
      ...body,
      id: projects[projectIndex].id, // Ensure id doesn't change
      createdAt: projects[projectIndex].createdAt, // Preserve creation date
      updatedDate: formattedDate, // Update the modification date
    }

    return NextResponse.json(projects[projectIndex])
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update project' },
      { status: 500 },
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: number } },
) {
  try {
    const { id } = params

    if (!id) {
      return NextResponse.json({ error: 'Invalid project id' }, { status: 400 })
    }

    const projectIndex = projects.findIndex((p) => p.id == id)

    if (projectIndex === -1) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    const deletedProject = projects.splice(projectIndex, 1)[0]
    return NextResponse.json(deletedProject)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete project' },
      { status: 500 },
    )
  }
}
