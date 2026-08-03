import { ImageResponse } from 'next/og'
import { readFile } from 'fs/promises'
import { join } from 'path'

export const runtime = 'nodejs'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  const imageData = await readFile(
    join(process.cwd(), 'public/images/official/gates/double-swing-hero.jpg'),
  )
  const imageBase64 = `data:image/jpeg;base64,${imageData.toString('base64')}`

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          width: '1200px',
          height: '630px',
          backgroundColor: '#1B1C1A',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Gate photo — right half; next/image cannot be used inside ImageResponse */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageBase64}
          style={{
            position: 'absolute',
            right: 0,
            top: 0,
            width: '55%',
            height: '100%',
            objectFit: 'cover',
          }}
          alt=""
        />

        {/* Dark gradient overlay over photo */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to right, #1B1C1A 42%, rgba(27,28,26,0.6) 65%, rgba(27,28,26,0.1) 100%)',
          }}
        />

        {/* Red accent bar */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: '6px',
            height: '100%',
            backgroundColor: '#9E000C',
          }}
        />

        {/* Content */}
        <div
          style={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            paddingLeft: '72px',
            paddingRight: '40px',
            maxWidth: '600px',
          }}
        >
          <p
            style={{
              fontFamily: 'sans-serif',
              fontSize: '13px',
              fontWeight: 400,
              letterSpacing: '0.25em',
              textTransform: 'uppercase',
              color: '#9E000C',
              margin: '0 0 20px',
            }}
          >
            Steelyes · UK Steel Fabrication
          </p>

          <h1
            style={{
              fontFamily: 'sans-serif',
              fontSize: '72px',
              fontWeight: 900,
              textTransform: 'uppercase',
              lineHeight: 0.9,
              color: '#F5F3F0',
              margin: '0 0 28px',
            }}
          >
            Bespoke
            <br />
            Steel Gates
          </h1>

          <p
            style={{
              fontFamily: 'sans-serif',
              fontSize: '18px',
              fontWeight: 300,
              color: 'rgba(245,243,240,0.75)',
              lineHeight: 1.5,
              margin: 0,
              maxWidth: '420px',
            }}
          >
            Made-to-measure driveway gates, electric gates &amp; steel fabrication. Survey-led, supply and install across the UK.
          </p>

          <div
            style={{
              display: 'flex',
              marginTop: '36px',
              backgroundColor: '#9E000C',
              padding: '12px 28px',
              width: 240,
              justifyContent: 'center',
            }}
          >
            <span
              style={{
                fontFamily: 'sans-serif',
                fontSize: '13px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                color: '#fff',
              }}
            >
              steelyes.co.uk
            </span>
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  )
}
