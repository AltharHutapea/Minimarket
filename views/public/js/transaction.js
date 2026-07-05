document.addEventListener('DOMContentLoaded', function() {
  const container = document.getElementById('productRows');
  const addBtn = document.getElementById('addRow');
  let rowIndex = 1;
 
  function updateSubtotal(row) {
    const select = row.querySelector('.product-select');
    const qtyInput = row.querySelector('.quantity-input');
    const subtotalSpan = row.querySelector('.subtotal-display');
    const price = parseFloat(select.options[select.selectedIndex]?.dataset?.price) || 0;
    const qty = parseInt(qtyInput.value) || 0;
    const subtotal = price * qty;
    subtotalSpan.textContent = 'Rp ' + subtotal.toLocaleString();
    updateGrandTotal();
  }
 
  function updateGrandTotal() {
    const subtotals = document.querySelectorAll('.subtotal-display');
    let total = 0;
    subtotals.forEach(el => {
      const val = parseFloat(el.textContent.replace(/[^0-9]/g, '')) || 0;
      total += val;
    });
    document.getElementById('grandTotal').textContent = 'Rp ' + total.toLocaleString();
  }
 
  container.addEventListener('change', function(e) {
    if (e.target.classList.contains('product-select') || e.target.classList.contains('quantity-input')) {
      const row = e.target.closest('.product-row');
      if (row) updateSubtotal(row);
    }
  });

  container.addEventListener('input', function(e) {
    if (e.target.classList.contains('quantity-input')) {
      const row = e.target.closest('.product-row');
      if (row) updateSubtotal(row);
    }
  });
 
  addBtn.addEventListener('click', function() {
    const newRow = document.createElement('div');
    newRow.className = 'row mb-2 product-row';
    newRow.innerHTML = `
      <div class="col-md-5">
        <select name="items[${rowIndex}][product_id]" class="form-select product-select" required>
          <option value="">-- Pilih --</option>
          ${document.querySelector('.product-select')?.innerHTML || ''}
        </select>
      </div>
      <div class="col-md-3">
        <input type="number" name="items[${rowIndex}][quantity]" class="form-control quantity-input" placeholder="Jumlah" min="1" required>
      </div>
      <div class="col-md-3">
        <span class="subtotal-display">Rp 0</span>
      </div>
      <div class="col-md-1">
        <button type="button" class="btn btn-danger remove-row"><i class="bi bi-trash"></i></button>
      </div>
    `;
    container.appendChild(newRow);
    rowIndex++;
  });
 
  container.addEventListener('click', function(e) {
    if (e.target.closest('.remove-row')) {
      const row = e.target.closest('.product-row');
      if (container.children.length > 1) {
        row.remove();
        updateGrandTotal();
      } else {
        alert('Minimal satu produk harus dipilih.');
      }
    }
  });
 
  document.getElementById('transactionForm').addEventListener('submit', function(e) {
     
    const selects = document.querySelectorAll('.product-select');
    const quantities = document.querySelectorAll('.quantity-input');
    for (let i = 0; i < selects.length; i++) {
      const selected = selects[i].options[selects[i].selectedIndex];
      const maxStock = parseInt(selected.dataset.stock) || 0;
      const qty = parseInt(quantities[i].value) || 0;
      if (qty > maxStock) {
        e.preventDefault();
        alert(`Stok tidak mencukupi untuk produk "${selected.text}". Maksimal ${maxStock}`);
        return;
      }
    } 
    const totalText = document.getElementById('grandTotal').textContent;
    if (!confirm(`Konfirmasi transaksi dengan total ${totalText}?`)) {
      e.preventDefault();
    }
  });
});