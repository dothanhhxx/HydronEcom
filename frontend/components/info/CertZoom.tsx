"use client";

// Ảnh giấy chứng nhận bấm để phóng to (dùng <dialog> gốc: Esc để đóng, khoá cuộn nền, bẫy focus sẵn).
import { useRef } from "react";
import { Icon } from "@/components/ds";

export default function CertZoom({ src, alt, w, h, label, className }: { src: string; alt: string; w: number; h: number; label: string; className?: string }) {
  const dlg = useRef<HTMLDialogElement>(null);
  return (
    <>
      <button type="button" className={`lt-cert-thumb ${className ?? ""}`} onClick={() => dlg.current?.showModal()} aria-label={`Phóng to ${label}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt} width={w} height={h} loading="lazy" decoding="async" />
        <span className="lt-cert-thumb-hint">
          <Icon name="search" size={15} />
          Xem bản chụp
        </span>
      </button>
      <dialog ref={dlg} className="lt-cert-dialog" aria-label={label} onClick={(e) => e.target === dlg.current && dlg.current?.close()}>
        <div className="lt-cert-dialog-inner">
          <div className="lt-cert-dialog-bar">
            <span>{label}</span>
            <a href={src} target="_blank" rel="noopener" className="lt-cert-dialog-open">
              <Icon name="external-link" size={15} />
              Mở ảnh gốc
            </a>
            <button type="button" onClick={() => dlg.current?.close()} aria-label="Đóng">
              <Icon name="x" size={18} />
            </button>
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt={alt} width={w} height={h} />
        </div>
      </dialog>
    </>
  );
}
