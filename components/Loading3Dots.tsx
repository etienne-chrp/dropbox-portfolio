'use client'

export default function Loading3Dots() {
    return (
        <div className="flex h-[calc(100vh-2rem)]">
            <div className="flex items-center justify-center space-x-2 animate-pulse m-auto">
                <div className="w-1 h-1 bg-black opacity-80 rounded-full" />
                <div className="w-1 h-1 bg-black opacity-80 rounded-full" />
                <div className="w-1 h-1 bg-black opacity-80 rounded-full" />
            </div>
        </div>
    )
}