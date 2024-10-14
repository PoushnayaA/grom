function tableSort() {
  const table = document.querySelector('.js-members-table table');

  if (table) {
    const headers = table.querySelectorAll('th');
    const tableBody = table.querySelector('tbody');
    const rows = tableBody.querySelectorAll('tr');

    const sortColumn = (index) => {
      const type = headers[index].getAttribute('data-sort') || 'string';
      const direction = headers[index].classList.contains('desc') ? 'asc' : 'desc';
      const multiplier = direction === 'asc' ? 1 : -1;
      const newRows = Array.from(rows);

      newRows.sort((rowA, rowB) => {
        const cellA = rowA.querySelectorAll('td')[index].textContent;
        const cellB = rowB.querySelectorAll('td')[index].textContent;

        let comparison = 0;
        if (type === 'number') {
          comparison = parseFloat(cellA) - parseFloat(cellB);
        } else {
          comparison = cellA.localeCompare(cellB);
        }

        return comparison * multiplier;
      });

      while (tableBody.firstChild) {
        tableBody.removeChild(tableBody.firstChild);
      }

      newRows.forEach(newRow => tableBody.appendChild(newRow));

      headers.forEach(header => {
        header.querySelectorAll('.arrows-sort').forEach(svg => svg.classList.remove('active'));
      });

      const currentHeader = headers[index];
      const topArrow = currentHeader.querySelector('.arrows-sort--top');
      const bottomArrow = currentHeader.querySelector('.arrows-sort:not(.arrows-sort--top)');

      if (direction === 'asc') {
        topArrow.classList.add('active');
        bottomArrow.classList.remove('active');
      } else {
        bottomArrow.classList.add('active');
        topArrow.classList.remove('active');
      }

      headers.forEach(header => header.classList.remove('asc', 'desc'));
      headers[index].classList.add(direction);
    };

    headers.forEach((header, index) => {
      header.addEventListener('click', () => {
        sortColumn(index);
      });
    });
  }
}

export { tableSort }
