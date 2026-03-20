import { ImageResponse } from 'next/og';

export const size = {
  width: 32,
  height: 32,
};

export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #031327, #071c3a)',
        }}
      >
        <div
          style={{
            fontSize: 22,
            fontWeight: 900,
            color: '#22d3ee',
            textShadow: '0 0 6px rgba(34,211,238,0.7)',
            fontFamily: 'Arial, sans-serif',
          }}
        >
          M
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}