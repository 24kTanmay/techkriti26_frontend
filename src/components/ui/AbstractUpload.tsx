'use client'

import React, { useState } from 'react'
import '@/components/ui/AbstractUpload.css'

interface AbstractUploadProps {
    eventTitle: string;
}

export default function AbstractUpload({ eventTitle }: AbstractUploadProps) {
    const [uploadStatus, setUploadStatus] = useState<'idle' | 'scanning' | 'complete'>('idle')
    const [fileName, setFileName] = useState<string>('')
    const [progress, setProgress] = useState<number>(0)

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setFileName(file.name)
        setUploadStatus('scanning')
        setProgress(0)

        let currentProgress = 0
        const interval = setInterval(() => {
            const increment = Math.random() * 7
            currentProgress += increment

            if (currentProgress >= 100) {
                currentProgress = 100
                setProgress(100)
                clearInterval(interval)
                setUploadStatus('complete')
            } else {
                setProgress(currentProgress)
            }
        }, 150)
    }

    const resetUpload = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setUploadStatus('idle')
        setFileName('')
    }

    return (
        <div className="abstract-upload-section">
            <h3 className="abstract-title">Technical <i>Abstract</i> Submission</h3>
            <p className="abstract-desc">
                Submit your project abstract as a PDF or high-resolution image. 
                Ensure it follows the guidelines mentioned in the Problem Statement.
            </p>

            <div className={`abstract-shard ${uploadStatus}`}>
                <div className="hologram-glow"></div>
                
                {uploadStatus === 'idle' && (
                    <label htmlFor="abstract-file" className="upload-trigger">
                        <div className="upload-icon">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/></svg>
                        </div>
                        <span className="upload-text">Upload Abstract Document</span>
                        <p className="upload-hint">PDF, PNG or JPG (Max 10MB)</p>
                        <input 
                            type="file" 
                            id="abstract-file" 
                            style={{ display: 'none' }} 
                            onChange={handleFileUpload}
                            accept=".pdf,image/*"
                        />
                    </label>
                )}

                {uploadStatus === 'scanning' && (
                    <div className="scanning-container">
                        <div className="scanning-header">
                            <div className="scanning-info">
                                <span className="scanning-label">SYNCING ARCHIVE</span>
                                <span className="scanning-file">{fileName.toUpperCase()}</span>
                            </div>
                            <div className="scanning-percent">{Math.floor(progress)}%</div>
                        </div>
                        <div className="scanning-bar-track">
                            <div className="scanning-bar-fill" style={{ width: `${progress}%` }}>
                                <div className="scanning-laser"></div>
                            </div>
                        </div>
                    </div>
                )}

                {uploadStatus === 'complete' && (
                    <div className="upload-success-state">
                        <div className="success-icon-wrap">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                        </div>
                        <div className="success-details">
                            <span className="success-msg">Upload Successful</span>
                            <p className="success-sub">Fragment: {fileName}</p>
                        </div>
                        <button className="re-upload-btn" onClick={resetUpload}>Change</button>
                    </div>
                )}
            </div>

            {uploadStatus === 'complete' && (
                <div className="abstract-status-hint">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '12px', flexShrink: 0, marginTop: '2px'}}><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                    <div>
                        The abstract is being processed. Check your <b>Dashboard</b> for real-time status updates.
                    </div>
                </div>
            )}
        </div>
    )
}
