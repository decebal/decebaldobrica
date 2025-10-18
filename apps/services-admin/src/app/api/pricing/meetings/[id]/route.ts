import { getSupabaseAdmin } from '@decebal/database'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = getSupabaseAdmin()

    const { data, error } = await supabase
      .from('payment_config')
      .select('*')
      .eq('id', params.id)
      .single()

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error('Failed to fetch meeting type:', error)
    return NextResponse.json(
      { error: 'Failed to fetch meeting type' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const supabase = getSupabaseAdmin()

    const { data, error } = await supabase
      .from('payment_config')
      .update(body)
      .eq('id', params.id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error('Failed to update meeting type:', error)
    return NextResponse.json(
      { error: 'Failed to update meeting type' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = getSupabaseAdmin()

    const { error } = await supabase
      .from('payment_config')
      .delete()
      .eq('id', params.id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to delete meeting type:', error)
    return NextResponse.json(
      { error: 'Failed to delete meeting type' },
      { status: 500 }
    )
  }
}
