// Configuración de Supabase
const SUPABASE_URL = "https://lsqviqpocydlctvksmrp.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxzcXZpcXBvY3lkbGN0dmtzbXJwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkwMTYxMjYsImV4cCI6MjEwNDU5MjEyNn0.oKqRgtVj-RTPnmL9R2KsMfyn5H5ZbH3LLfFx_RCSmtw"; 
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

document.addEventListener("DOMContentLoaded", () => {
    cargarComponentes();

    const form = document.getElementById("componenteForm");
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const codigo = document.getElementById("codigo").value;
        const nombre = document.getElementById("nombre").value;
        const categoria = document.getElementById("categoria").value;
        const marca = document.getElementById("marca").value;
        const cantidad = parseInt(document.getElementById("cantidad").value);
        const estado = document.getElementById("estado").value;
        const descripcion = document.getElementById("descripcion").value;

        const { error } = await supabaseClient
            .from("componentes")
            .insert([{ codigo, nombre, categoria, marca, cantidad, estado, descripcion }]);

        if (error) {
            alert("Error al guardar en la nube: " + error.message);
        } else {
            alert("¡Componente guardado con éxito!");
            form.reset();
            cargarComponentes();
        }
    });
});

async function cargarComponentes() {
    const { data, error } = await supabaseClient
        .from("componentes")
        .select("*")
        .order("id", { ascending: false });

    const tbody = document.getElementById("tablaComponentes");
    tbody.innerHTML = "";

    if (error) {
        console.error("Error al cargar:", error.message);
        return;
    }

    if (data) {
        data.forEach(comp => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${comp.codigo}</td>
                <td>${comp.nombre}</td>
                <td>${comp.categoria}</td>
                <td>${comp.cantidad}</td>
                <td>${comp.estado}</td>
                <td><button class="btn-danger" onclick="eliminarComponente(${comp.id})">Eliminar</button></td>
            `;
            tbody.appendChild(tr);
        });
    }
}

async function eliminarComponente(id) {
    if (confirm("¿Estás seguro de eliminar este componente?")) {
        const { error } = await supabaseClient
            .from("componentes")
            .delete()
            .eq("id", id);

        if (error) {
            alert("Error al eliminar: " + error.message);
        } else {
            cargarComponentes();
        }
    }
}