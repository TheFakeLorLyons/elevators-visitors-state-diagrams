import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.esm.min.mjs';

document.addEventListener('DOMContentLoaded', function() {
    mermaid.initialize({ startOnLoad: true,
                         zoom: true,
                         zoomWidth: '100%',
                         zoomHeight: '100%'
    });
    
    function renderMermaidForElement(targetElement) {
        fetch(targetElement.dataset.diagramSrc)
            .then(response => response.text())
            .then(data => {
                targetElement.innerHTML = `<div class="mermaid">${data}</div>`;
                mermaid.contentLoaded();
            })
            .catch(error => console.error('Error loading Mermaid chart:', error));
    }

    const firstDiagram = document.querySelector('.carousel-item.active [id$="-mmd"]');
    if (firstDiagram) {
        firstDiagram.dataset.diagramSrc = firstDiagram.id === 'visitor-mmd' 
            ? 'diagrams/visitor.md' 
            : 'diagrams/elevator.md';
        renderMermaidForElement(firstDiagram);
    }
    $('#stateCarousel').on('slid.bs.carousel', function () {
        const activeDiagram = $(".carousel-item.active [id$='-mmd']")[0];
        if (activeDiagram && !activeDiagram.classList.contains('rendered')) {
            activeDiagram.dataset.diagramSrc = activeDiagram.id === 'visitor-mmd' 
                ? 'diagrams/visitor.md' 
                : 'diagrams/elevator.md';
            renderMermaidForElement(activeDiagram);
            activeDiagram.classList.add('rendered');
        }
    });
});
