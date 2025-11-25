import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const machine = searchParams.get('machine')
    const spindle = searchParams.get('spindle')
    const bit = searchParams.get('bit')
    const material = searchParams.get('material')
    const remember = searchParams.get('remember')

    // Validate required fields
    if (!machine || !spindle || !bit || !material) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Here you would typically process the data or store it in a database
    // For now, we'll just return a success response with the data
    const response = {
      success: true,
      data: {
        machine,
        spindle,
        bit,
        material,
        remember: remember === 'true'
      },
      message: 'Values received successfully'
    }

    return NextResponse.json(response, { status: 200 })
  } catch (error) {
    console.error('Error processing request:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { machine, spindle, bit, material, remember } = body

    // Validate required fields
    if (!machine || !spindle || !bit || !material) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Here you would typically process the data or store it in a database
    // For now, we'll just return a success response with the data
    const response = {
      success: true,
      data: {
        machine,
        spindle,
        bit,
        material,
        remember
      },
      message: 'Values received successfully'
    }

    return NextResponse.json(response, { status: 200 })
  } catch (error) {
    console.error('Error processing request:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 