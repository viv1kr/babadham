import React, { useEffect } from 'react';
import { useStore } from '../../context/StoreContext';

export const ScriptInjector: React.FC = () => {
  const { brandSettings } = useStore();

  useEffect(() => {
    if (!brandSettings) return;

    const injectScripts = (html: string, target: HTMLElement, id: string, prepend: boolean = false) => {
      if (!html || html.trim() === '') return;
      
      // Clean up previous injection
      const oldElement = document.getElementById(id);
      if (oldElement) {
        oldElement.remove();
      }

      // Create a wrapper
      const wrapper = document.createElement('div');
      wrapper.id = id;
      wrapper.style.display = 'none';

      try {
        // Contextual fragment parses <script> tags so they actually execute
        const fragment = document.createRange().createContextualFragment(html);
        wrapper.appendChild(fragment);
        
        if (prepend) {
          target.insertBefore(wrapper, target.firstChild);
        } else {
          target.appendChild(wrapper);
        }
      } catch (err) {
        console.warn(`Failed to inject script for ${id}:`, err);
      }
    };

    // Header scripts go to <head>
    injectScripts(brandSettings.headerScripts || '', document.head, 'babadham-header-scripts');
    
    // Body start scripts prepend to <body>
    injectScripts(brandSettings.bodyScripts || '', document.body, 'babadham-body-scripts', true);
    
    // Footer scripts append to <body>
    injectScripts(brandSettings.footerScripts || '', document.body, 'babadham-footer-scripts');

    return () => {
      document.getElementById('babadham-header-scripts')?.remove();
      document.getElementById('babadham-body-scripts')?.remove();
      document.getElementById('babadham-footer-scripts')?.remove();
    };
  }, [brandSettings?.headerScripts, brandSettings?.bodyScripts, brandSettings?.footerScripts]);

  return null;
};
