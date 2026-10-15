const SUPABASE_URL = "https://lsqviqpocydlctvksmrp.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxzcXZpcXBvY3lkbGN0dmtzbXJwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkwMTYxMjYsImV4cCI6MjEwNDU5MjEyNn0.oKqRgtVj-RTPnmL9R2KsMfyn5H5ZbH3LLfFx_RCSmtw"; 

const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

document.addEventListener("DOMContentLoaded", () => {
    cargarComponentes();

    const form = document.getElementById("componenteForm");
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const editId = document.getElementById("editId").value;
        const codigo = document.getElementById("codigo").value;
        const nombre = document.getElementById("nombre").value;
        const categoria = document.getElementById("categoria").value;
        const marca = document.getElementById("marca").value;
        const cantidad = parseInt(document.getElementById("cantidad").value);
        const estado = document.getElementById("estado").value;
        const descripcion = document.getElementById("descripcion").value;

        if (editId) {
            const { error } = await supabaseClient
                .from("componentes")
                .update({ codigo, nombre, categoria, marca, cantidad, estado, descripcion })
                .eq("id", editId);

            if (error) {
                alert("Error al actualizar: " + error.message);
            } else {
                alert("¡Componente actualizado con éxito!");
                cancelarEdicion();
                cargarComponentes();
            }
        } else {
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

    if (data && data.length > 0) {
        data.forEach(comp => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${comp.codigo}</td>
                <td>${comp.nombre}</td>
                <td>${comp.categoria || '-'}</td>
                <td>${comp.marca || '-'}</td>
                <td>${comp.cantidad}</td>
                <td>${comp.estado}</td>
                <td>
                    <button class="btn-warning" onclick="prepararEdicion(${comp.id}, '${comp.codigo}', '${comp.nombre}', '${comp.categoria}', '${comp.marca}', ${comp.cantidad}, '${comp.estado}', \`${comp.descripcion || ''}\`)" style="background:#f59e0b; color:white; border:none; padding:5px 8px; border-radius:4px; cursor:pointer; font-size:0.8rem; margin-right:4px;">Editar</button>
                    <button class="btn-danger" onclick="eliminarComponente(${comp.id})" style="background:#dc2626; color:white; border:none; padding:5px 8px; border-radius:4px; cursor:pointer; font-size:0.8rem;">Eliminar</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    } else {
        tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; color:#64748b;">No hay componentes registrados todavía.</td></tr>`;
    }
}

function prepararEdicion(id, codigo, nombre, categoria, marca, cantidad, estado, descripcion) {
    document.getElementById("editId").value = id;
    document.getElementById("codigo").value = codigo;
    document.getElementById("nombre").value = nombre;
    document.getElementById("categoria").value = categoria;
    document.getElementById("marca").value = marca;
    document.getElementById("cantidad").value = cantidad;
    document.getElementById("estado").value = estado;
    document.getElementById("descripcion").value = descripcion === "null" ? "" : descripcion;

    document.getElementById("formTitle").innerText = "Editar Componente";
    document.getElementById("btnSubmit").innerText = "Actualizar Registro";
    document.getElementById("btnCancel").style.display = "block";
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function cancelarEdicion() {
    document.getElementById("componenteForm").reset();
    document.getElementById("editId").value = "";
    document.getElementById("formTitle").innerText = "Registrar Componente";
    document.getElementById("btnSubmit").innerText = "Guardar Registro";
    document.getElementById("btnCancel").style.display = "none";
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