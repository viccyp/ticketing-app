import Link from 'next/link'

interface LogoProps {
  className?: string
  height?: number
  showTagline?: boolean
}

export default function Logo({ className = '', height = 50, showTagline = false }: LogoProps) {
  return (
    <div className={className}>
      <div>
        <Link href="/" className="inline-block">
          <img
            src="/vic valentine logo white.png"
            alt="Vic Valentine"
            height={height}
            className="h-auto w-auto max-h-[30px] md:max-h-[50px]"
            style={{ width: 'auto' }}
          />
        </Link>
        {showTagline && (
          <p className="text-gray-400 mt-1 md:mt-2 text-xs md:text-sm" style={{ paddingLeft: '0.5rem' }}>presents...</p>
        )}
      </div>
    </div>
  )
}
