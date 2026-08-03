import { ImageResponse } from 'next/og'

export const size = {
  width: 180,
  height: 180,
}

export const contentType = 'image/png'

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: 'center',
          background: '#1B1C1A',
          color: '#FFFFFF',
          display: 'flex',
          fontSize: 104,
          fontWeight: 900,
          height: '100%',
          justifyContent: 'center',
          letterSpacing: '-0.08em',
          lineHeight: 1,
          width: '100%',
        }}
      >
        S
      </div>
    ),
    size,
  )
}
