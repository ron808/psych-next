import Link from 'next/link';

export default function NotFound() {
  return (
    <div
      className="page page-content"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        minHeight: '100dvh',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, padding: '0 24px' }}>
        <div
          style={{
            fontSize: '5rem',
            fontWeight: 600,
            background: 'linear-gradient(135deg, var(--accent), var(--indigo))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            lineHeight: 1.1,
          }}
        >
          404
        </div>
        <h1 style={{ fontFamily: 'var(--font-head)', fontSize: 'clamp(1.5rem, 4vw, 2.2rem)', fontWeight: 700 }}>
          Lost in the cosmos
        </h1>
        <p style={{ color: 'var(--muted)', maxWidth: 400, lineHeight: 1.6 }}>
          This page doesn&apos;t exist — but your personality type does.
        </p>
        <Link href="/" className="btn btn-primary">
          Return home
        </Link>
      </div>
    </div>
  );
}
