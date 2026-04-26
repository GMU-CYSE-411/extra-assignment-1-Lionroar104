(async function bootstrapAdmin() {
  try {
    const user = await loadCurrentUser();

    if (!user) {
      document.getElementById("admin-warning").textContent = "Please log in first.";
      return;
    }

    if (user.role !== "admin") {
      document.getElementById("admin-warning").textContent =
        "Unauthorized access.";
      return;
    }

    document.getElementById("admin-warning").textContent = "Authenticated as admin.";
        
    const result = await api("/api/admin/users");

    const table = document.getElementById("admin-users");
    table.innerHTML = ""; 

    result.users.forEach((entry) => {
      const row = document.createElement("tr");

      const fields = ["id", "username", "role", "displayName", "noteCount"];

      fields.forEach((field) => {
        const column = document.createElement("td");
        column.textContent = entry[field];
        row.appendChild(column);
      });

      table.appendChild(row);
    });

  } catch (error) {
    
    document.getElementById("admin-warning").textContent = error.message;
  }
})();
