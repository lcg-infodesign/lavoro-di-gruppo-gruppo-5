function initNavigation() {
    console.log("Navigazione inizializzata");
    
    const canvas = document.querySelector("canvas");
    if (!canvas) {
      console.error("Canvas non trovato!");
      return;
    }
  
    // Esempio di logica di navigazione (da personalizzare)
    canvas.addEventListener("click", (event) => {
      console.log("Canvas cliccato:", event.clientX, event.clientY);
    });
  }
  