'use client'

import React, { useRef, useEffect } from 'react'
import './PaymentInstructions.css'

interface PaymentInstructionsProps {
    onClose: () => void;
}

export default function PaymentInstructions({ onClose }: PaymentInstructionsProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    const steps = [
        "Click on 'Proceed for Payment' to open SBI Collect.",
        "Select 'Educational Institutions' and search for 'Indian Institute of Technology Kanpur'.",
        "Choose 'TechKriti Registration' as the payment category.",
        "Enter your details, complete the payment, and download the receipt.",
        "Return here and upload your receipt. Our team will verify it and confirm your registration."
    ]

    return (
        <div className="instr-overlay">
            <div className="instr-container simple">
                <div className="instr-header">
                    <h2 className="modal-title-instr">Payment <i>Steps</i></h2>
                </div>

                <div className="steps-list-simple">
                    {steps.map((step, i) => (
                        <div key={i} className="step-item-simple">
                            <span className="step-number-simple">{i + 1}</span>
                            <p className="step-text-simple">{step}</p>
                        </div>
                    ))}
                </div>

                <div className="instr-footer">
                    <button className="btn btn-primary" style={{ width: '100%' }} onClick={onClose}>Close</button>
                </div>
            </div>
        </div>
    )
}
