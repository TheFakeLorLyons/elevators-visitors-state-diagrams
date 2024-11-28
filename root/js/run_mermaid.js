import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.esm.min.mjs';

document.addEventListener('DOMContentLoaded', function() {
    mermaid.initialize({ startOnLoad: true,
                         zoom: true,
                         zoomWidth: '100%',
                         zoomHeight: '100%'
    });
    
    function getDiagramSource(id) {
        const diagramSources = {
            'class-mmd': 'diagrams/full_class_diagram.md',
            'visitor-mmd': 'diagrams/visitor.md',
            'elevator-mmd': 'diagrams/elevator.md',
            'activity-mmd': 'diagrams/run_sim_act_diagram.md',
            'sequence-mmd': 'diagrams/run_sim_seq_diagram.md',
            'ride-seq-mmd': 'diagrams/elevator_ride_sequence.md'
        };
        return diagramSources[id] || `diagrams/${id}.md`;
    }

    function renderMermaidForElement(targetElement) {
        if (!targetElement || targetElement.classList.contains('rendered')) {
            return;
        }

        fetch(targetElement.dataset.diagramSrc)
            .then(response => response.text())
            .then(data => {
                targetElement.innerHTML = `<div class="mermaid">${data}</div>`;
                mermaid.contentLoaded();
                targetElement.classList.add('rendered');
            })
            .catch(error => console.error('Error loading Mermaid chart:', error));
    }

    function initializeDiagrams() {
        const allDiagrams = document.querySelectorAll('[id$="-mmd"]');
        allDiagrams.forEach(diagram => {
            diagram.dataset.diagramSrc = getDiagramSource(diagram.id);
            if (diagram.closest('.carousel-item.active')) {
                renderMermaidForElement(diagram);
            }
        });
    }

    initializeDiagrams();

    $('#stateCarousel').on('slid.bs.carousel', function () {
        const activeDiagram = document.querySelector(".carousel-item.active [id$='-mmd']");
        if (activeDiagram) {
            renderMermaidForElement(activeDiagram);
        }
    });
});
