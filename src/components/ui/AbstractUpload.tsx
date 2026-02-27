'use client'

import React, { useState } from 'react'
import { UploadIcon, CheckIcon, InfoIcon } from '../common/Icons'
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
                            <UploadIcon />
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
                            <CheckIcon size={20} strokeWidth={3} />
                        </div>
                        <div className="success-details">
                            <span className="success-msg">Upload Successful</span>
                            <p className="success-sub">Fragment: {fileName}</p>
                        </div>
                        <button className="btn btn-secondary" style={{ padding: '6px 14px', fontSize: '0.7rem' }} onClick={resetUpload}>Change</button>
                    </div>
                )}
            </div>

            {uploadStatus === 'complete' && (
                <div className="abstract-status-hint">
                    <InfoIcon size={14} style={{ marginRight: '12px', flexShrink: 0, marginTop: '2px' }} />
                    <div>
                        The abstract is being processed. Check your <b>Dashboard</b> for real-time status updates.
                    </div>
                </div>
            )}
        </div>
    )
}
