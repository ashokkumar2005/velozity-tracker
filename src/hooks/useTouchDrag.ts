import { useEffect, useRef } from 'react';
import { Status } from '../types';

interface Options {
  onMove: (taskId: string, toStatus: Status) => void;
}

/**
 * Minimal touch drag support for Kanban cards.
 * Attaches touchstart/touchmove/touchend listeners to the container.
 * Uses document.elementFromPoint to find the drop target column.
 */
export function useTouchDrag(containerRef: React.RefObject<HTMLElement>, { onMove }: Options) {
  const dragging = useRef<{ taskId: string; ghost: HTMLElement } | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    function getTaskId(el: Element | null): string | null {
      if (!el) return null;
      const card = el.closest('[data-card-id]');
      return card ? card.getAttribute('data-card-id') : null;
    }

    function getColumnStatus(el: Element | null): Status | null {
      if (!el) return null;
      const col = el.closest('[data-column-status]');
      return col ? (col.getAttribute('data-column-status') as Status) : null;
    }

    function onTouchStart(e: TouchEvent) {
      const touch = e.touches[0];
      const target = document.elementFromPoint(touch.clientX, touch.clientY);
      const taskId = getTaskId(target);
      if (!taskId) return;

      // Create ghost element
      const cardEl = (target as Element).closest('[data-card-id]') as HTMLElement;
      if (!cardEl) return;

      const rect = cardEl.getBoundingClientRect();
      const ghost = cardEl.cloneNode(true) as HTMLElement;
      ghost.style.cssText = `
        position: fixed;
        left: ${rect.left}px;
        top: ${rect.top}px;
        width: ${rect.width}px;
        opacity: 0.75;
        pointer-events: none;
        z-index: 9999;
        box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        transition: none;
      `;
      document.body.appendChild(ghost);
      dragging.current = { taskId, ghost };
    }

    function onTouchMove(e: TouchEvent) {
      if (!dragging.current) return;
      e.preventDefault();
      const touch = e.touches[0];
      const { ghost } = dragging.current;
      ghost.style.left = `${touch.clientX - ghost.offsetWidth / 2}px`;
      ghost.style.top  = `${touch.clientY - 20}px`;
    }

    function onTouchEnd(e: TouchEvent) {
      if (!dragging.current) return;
      const { taskId, ghost } = dragging.current;
      ghost.remove();
      dragging.current = null;

      const touch = e.changedTouches[0];
      const dropTarget = document.elementFromPoint(touch.clientX, touch.clientY);
      const toStatus = getColumnStatus(dropTarget);
      if (toStatus) onMove(taskId, toStatus);
    }

    container.addEventListener('touchstart', onTouchStart, { passive: true });
    container.addEventListener('touchmove',  onTouchMove,  { passive: false });
    container.addEventListener('touchend',   onTouchEnd,   { passive: true });

    return () => {
      container.removeEventListener('touchstart', onTouchStart);
      container.removeEventListener('touchmove',  onTouchMove);
      container.removeEventListener('touchend',   onTouchEnd);
    };
  }, [containerRef, onMove]);
}
