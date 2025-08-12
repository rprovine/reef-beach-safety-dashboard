import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const size = {
  width: 32,
  height: 32,
}

export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 24,
          background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          borderRadius: '8px',
        }}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M2 12c.6-.6 1.4-1 2.2-1 1.3 0 2 .8 3.3.8 1.3 0 2-.8 3.3-.8 1.3 0 2 .8 3.3.8 1.3 0 2-.8 3.3-.8 1.3 0 2 .8 3.3.8.8 0 1.6-.4 2.2-1" />
          <path d="M2 16c.6-.6 1.4-1 2.2-1 1.3 0 2 .8 3.3.8 1.3 0 2-.8 3.3-.8 1.3 0 2 .8 3.3.8 1.3 0 2-.8 3.3-.8 1.3 0 2 .8 3.3.8.8 0 1.6-.4 2.2-1" />
          <path d="M2 8c.6-.6 1.4-1 2.2-1 1.3 0 2 .8 3.3.8 1.3 0 2-.8 3.3-.8 1.3 0 2 .8 3.3.8 1.3 0 2-.8 3.3-.8 1.3 0 2 .8 3.3.8.8 0 1.6-.4 2.2-1" />
        </svg>
      </div>
    ),
    {
      ...size,
    }
  )
}