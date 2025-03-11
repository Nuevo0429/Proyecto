let loggedInUser = null;
let cart = [];
let totalPrice = 0;
let products = [
    { name: 'Reloj', price: 50, image: 'imagenes/reloj.webp' },
    { name: 'Laptop', price: 850, image: 'imagenes/laptop.webp' },
    { name: 'Audifonos', price: 15, image: 'imagenes/audifonos.jpg' }
];

// Agregar evento para mostrar el formulario de registro
document.getElementById('registerLink').addEventListener('click', function() {
    document.getElementById('registerForm').style.display = 'block';
});

function registerUser() {
    let newUsername = document.getElementById('newUsername').value;
    let newPassword = document.getElementById('newPassword').value;
    let newUserRole = document.getElementById('newUserRole').value;

    if (newUsername && newPassword) {
        if (users[newUsername]) {
            alert('El usuario ya existe. Elige otro nombre.');
            return;
        }

        users[newUsername] = { password: newPassword, role: newUserRole };
        alert(`Usuario ${newUsername} registrado como ${newUserRole}.`);

        // Limpiar el formulario
        document.getElementById('newUsername').value = '';
        document.getElementById('newPassword').value = '';
        document.getElementById('newUserRole').value = 'comprador';
        document.getElementById('registerForm').style.display = 'none';

        renderUserSelect(); // Actualizar la lista de usuarios si es admin
    } else {
        alert('Por favor completa todos los campos.');
    }
}

function addProduct() {
    const productName = document.getElementById('productName').value;
    const productPrice = document.getElementById('productPrice').value;
    const productImage = document.getElementById('productImage').files[0];

    if (productName && productPrice && productImage) {
        const product = {
            name: productName,
            price: parseFloat(productPrice),
            image: URL.createObjectURL(productImage)
        };
        
        products.push(product); // Agregar a la lista de productos
        renderProducts(); // Volver a renderizar los productos
        
        alert(`Producto añadido: ${productName} - $${productPrice}`);
        
        // Limpiar los campos después de agregar
        document.getElementById('productName').value = '';
        document.getElementById('productPrice').value = '';
        document.getElementById('productImage').value = '';

    } else {
        alert('Por favor complete todos los campos');
    }
}

const users = {
    'seller456': { password: 'Intro123', role: 'comprador' },
    'dancabello': { password: 'J5*asdRD.s', role: 'vendedor' },
    'root': { password: 'dochouse', role: 'admin' }
};

// Función para mostrar productos
function renderProducts() {
    const productListDiv = document.getElementById('productList');
    productListDiv.innerHTML = '';

    products.forEach(product => {
        const productDiv = document.createElement('div');
        productDiv.className = 'product';
        productDiv.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>$${product.price}</p>
            <button class="btn" onclick="addToCart('${product.name}', ${product.price})">Añadir al carrito</button>
            <button class="btn" onclick="buyNow('${product.name}', ${product.price})">Comprar de una vez</button>
        `;
        productListDiv.appendChild(productDiv);
    });
}

function addToCart(product, price) {
    cart.push({ product, price });
    totalPrice += price;
    document.getElementById('cartCount').textContent = cart.length;
    renderCart(); // Actualizar carrito después de agregar un producto
}

function buyNow(product, price) {
    cart.push({ product, price });
    totalPrice += price;
    document.getElementById('cartCount').textContent = cart.length;
    alert(`¡Has comprado ${product} de una vez!`);
    renderCart(); // Asegurar que se actualiza el carrito
}

// FUNCIONES PARA LOGIN
document.getElementById('loginLink').addEventListener('click', function() {
    document.getElementById('loginForm').style.display = 'block';
});

function login() {
    let username = document.getElementById('username').value;
    let password = document.getElementById('password').value;

    if (users[username] && users[username].password === password) {
        loggedInUser = { username, role: users[username].role };
        alert(`Bienvenido, ${username}!`);
        document.getElementById('loginForm').style.display = 'none';
        updateUI();
        renderProducts(); //  Llamar nuevamente para mostrar los botones de eliminación
        if (loggedInUser.role === 'admin') {
            renderUsers(); //  Mostrar lista de usuarios si es admin
        }
    } else {
        alert('Usuario o contraseña incorrectos.');
    }
}


function logout() {
    loggedInUser = null;
    updateUI();
}

function updateUI() {
    document.getElementById('loginLink').style.display = loggedInUser ? 'none' : 'inline';
    document.getElementById('logoutLink').style.display = loggedInUser ? 'inline' : 'none';
    document.getElementById('adminLink').style.display = 'none';
    document.getElementById('vendedorLink').style.display = 'none';
    document.getElementById('vendedorForm').style.display = 'none';
    document.getElementById('adminForm').style.display = 'none';

    if (loggedInUser) {
        if (loggedInUser.role === 'admin') {
            document.getElementById('adminLink').style.display = 'inline';
            renderUserSelect();
            renderProductSelect();
        } else if (loggedInUser.role === 'vendedor') {
            document.getElementById('vendedorLink').style.display = 'inline';
            document.getElementById('vendedorForm').style.display = 'block';
        }
    }
}
// Alternar visibilidad del formulario de vendedor al hacer clic en "Vendedor"
document.getElementById('vendedorLink').addEventListener('click', function() {
    let form = document.getElementById('vendedorForm');
    let computedStyle = window.getComputedStyle(form).display;

    // Si está oculto, lo mostramos; si está visible, lo ocultamos
    form.style.display = (computedStyle === 'none') ? 'block' : 'none';
});

// Función para comprar todos los productos del carrito
function buyAll() {
    if (cart.length > 0) {
        let cartDetails = cart.map(item => `${item.product} - $${item.price}`).join("\n");
        alert(`¡Gracias por tu compra!\n\nProductos comprados:\n${cartDetails}\n\nTotal: $${totalPrice}`);

        // Vaciar el carrito después de la compra
        cart = [];
        totalPrice = 0;

        // Actualizar la interfaz
        document.getElementById('cartCount').textContent = cart.length;
        renderCart(); // Llamamos a renderCart para actualizar la vista
    } else {
        alert('El carrito está vacío.');
    }
}

function deleteProduct() {
    const productName = document.getElementById('productSelect').value;
    if (productName) {
        products = products.filter(product => product.name !== productName);
        renderProducts(); // Volver a renderizar los productos
        renderProductSelect(); // Actualizar la lista de productos en el select
        alert(`Producto ${productName} eliminado`);
    } else {
        alert('Selecciona un producto para eliminar');
    }
}

function deleteUser() {
    const username = document.getElementById('userSelect').value;
    if (username && users[username]) {
        if (username === 'root') {
            alert('No se puede eliminar al administrador');
            return;
        }
        delete users[username];
        alert(`Usuario ${username} eliminado`);
        renderUserSelect(); // Volver a renderizar la lista de usuarios
    } else {
        alert('Selecciona un usuario para eliminar');
    }
}

function renderProductSelect() {
    const productSelect = document.getElementById('productSelect');
    productSelect.innerHTML = '<option value="">Seleccione un producto</option>';
    products.forEach(product => {
        productSelect.innerHTML += `<option value="${product.name}">${product.name}</option>`;
    });
}

function renderUserSelect() {
    const userSelect = document.getElementById('userSelect');
    userSelect.innerHTML = '<option value="">Seleccione un usuario</option>';
    for (let username in users) {
        if (username !== 'root') { // Evita que el admin se elimine a sí mismo
            userSelect.innerHTML += `<option value="${username}">${username} - ${users[username].role}</option>`;
        }
    }
}

function renderCart() {
    const cartDiv = document.getElementById('cart');
    cartDiv.innerHTML = `<p>Carrito: <span id="cartCount">${cart.length}</span> productos</p>`;
    
    if (cart.length > 0) {
        cart.forEach((item, index) => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <p>${item.product} - $${item.price}</p>
                <button class="btn" onclick="removeFromCart(${index})">Eliminar</button>
            `;
            cartDiv.appendChild(cartItem);
        });
    }

    cartDiv.innerHTML += `
        <button class="btn" onclick="viewCart()">Ver carrito</button>
        <button class="btn" onclick="buyAll()">Comprar todo</button>
    `;
}

function removeFromCart(index) {
    totalPrice -= cart[index].price; // Restar el precio del producto eliminado
    cart.splice(index, 1); // Eliminar producto del carrito
    document.getElementById('cartCount').textContent = cart.length; // Actualizar contador
    renderCart(); // Volver a mostrar el carrito actualizado
}


document.getElementById('logoutLink').addEventListener('click', logout);
document.getElementById('vendedorLink').addEventListener('click', function() {
    document.getElementById('vendedorForm').style.display = 'block';
});
document.getElementById('adminLink').addEventListener('click', function() {
    document.getElementById('adminForm').style.display = 'block';
});

document.getElementById('registerLink').addEventListener('click', function() {
    document.getElementById('registerForm').style.display = 'block';
});

// Renderizar productos al inicio
document.addEventListener('DOMContentLoaded', function() {
    renderProducts();
    renderProductSelect();
    renderUserSelect();
});
