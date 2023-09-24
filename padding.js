function setPadding() {
    const div = document.getElementById("content");
    const screenWidth = window.innerWidth;
    const defaultPadding = 16;
    const minPadding = 4;
    const screenMaxWidth = 1920; // Hier setzen Sie die maximale Bildschirmbreite
  
    // Berechnung des angepassten Paddings
    let paddingValue = minPadding + (defaultPadding - minPadding) * (screenWidth / screenMaxWidth)
  
    // Stellen Sie sicher, dass das Padding nicht unter den Mindestwert fällt und nicht über den Standardwert steigt
    paddingValue = Math.max(paddingValue, minPadding);
    paddingValue = Math.min(paddingValue, defaultPadding);
  
    // Padding auf die linken und rechten Seiten des DIVs anwenden
    div.style.paddingLeft = `${paddingValue}%`;
    div.style.paddingRight = `${paddingValue}%`;
  }
  
  // Initial das Padding setzen
  setPadding();
  
  // Das Padding aktualisieren, wenn sich die Bildschirmgröße ändert
  window.addEventListener("resize", setPadding);
  