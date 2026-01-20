const canvas = document.getElementById("dashboardCanvas");
const ctx = canvas.getContext("2d");

const metricForm = document.getElementById("metricForm");
const editForm = document.getElementById("editForm");
const emptyState = document.getElementById("emptyState");
const deleteMetricButton = document.getElementById("deleteMetric");
const resetLayoutButton = document.getElementById("resetLayout");

const palette = {
  social: { fill: "#e4f2ff", accent: "#1e5aa8" },
  paid: { fill: "#ffece1", accent: "#a24a00" },
  mixed: { fill: "#efe7ff", accent: "#5a2db3" },
};

let metrics = [];
let selectedId = null;
let dragTarget = null;
let dragOffset = { x: 0, y: 0 };

const layoutDefaults = {
  width: 220,
  height: 140,
  gap: 20,
  startX: 24,
  startY: 24,
};

const defaultMetrics = [
  {
    title: "Alcance orgânico",
    value: 240000,
    unit: "impressões",
    context: "social",
    notes: "Meta do mês +12%.",
  },
  {
    title: "Engajamento",
    value: 4.3,
    unit: "%",
    context: "social",
    notes: "Stories e reels puxando a média.",
  },
  {
    title: "Investimento",
    value: 18500,
    unit: "R$",
    context: "paid",
    notes: "Distribuir 65% para conversão.",
  },
  {
    title: "CPA médio",
    value: 42,
    unit: "R$",
    context: "paid",
    notes: "Monitorar criativos em teste A/B.",
  },
];

function resizeCanvas() {
  const { width, height } = canvas.getBoundingClientRect();
  const ratio = window.devicePixelRatio || 1;
  canvas.width = width * ratio;
  canvas.height = height * ratio;
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  draw();
}

function createMetric(data) {
  const id = crypto.randomUUID();
  const position = nextAvailablePosition();
  const metric = {
    id,
    title: data.title,
    value: Number(data.value),
    unit: data.unit || "",
    context: data.context,
    notes: data.notes || "",
    x: position.x,
    y: position.y,
    width: layoutDefaults.width,
    height: layoutDefaults.height,
  };
  metrics.push(metric);
  return metric;
}

function nextAvailablePosition() {
  const columns = Math.max(
    1,
    Math.floor(
      (canvas.getBoundingClientRect().width - layoutDefaults.startX) /
        (layoutDefaults.width + layoutDefaults.gap)
    )
  );
  const index = metrics.length;
  const col = index % columns;
  const row = Math.floor(index / columns);
  return {
    x: layoutDefaults.startX + col * (layoutDefaults.width + layoutDefaults.gap),
    y: layoutDefaults.startY + row * (layoutDefaults.height + layoutDefaults.gap),
  };
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#f2f4fb";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  metrics.forEach((metric) => {
    const { fill, accent } = palette[metric.context] || palette.mixed;
    const isSelected = metric.id === selectedId;

    ctx.save();
    ctx.fillStyle = fill;
    ctx.strokeStyle = isSelected ? "#1f2532" : "rgba(31, 37, 50, 0.12)";
    ctx.lineWidth = isSelected ? 2 : 1;
    roundRect(ctx, metric.x, metric.y, metric.width, metric.height, 16);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = accent;
    ctx.font = "600 13px Inter, sans-serif";
    ctx.fillText(metric.context === "paid" ? "Tráfego Pago" : metric.context === "social" ? "Social Media" : "Misto", metric.x + 16, metric.y + 26);

    ctx.fillStyle = "#1f2532";
    ctx.font = "600 20px Inter, sans-serif";
    ctx.fillText(metric.title, metric.x + 16, metric.y + 56);

    ctx.fillStyle = "#1f2532";
    ctx.font = "700 28px Inter, sans-serif";
    ctx.fillText(formatValue(metric.value), metric.x + 16, metric.y + 92);

    ctx.fillStyle = "#5b6375";
    ctx.font = "500 13px Inter, sans-serif";
    ctx.fillText(metric.unit, metric.x + 16, metric.y + 112);

    ctx.fillStyle = "#5b6375";
    ctx.font = "500 12px Inter, sans-serif";
    wrapText(ctx, metric.notes, metric.x + 16, metric.y + 128, metric.width - 32, 14);

    ctx.restore();
  });
}

function roundRect(context, x, y, width, height, radius) {
  const r = Math.min(radius, width / 2, height / 2);
  context.beginPath();
  context.moveTo(x + r, y);
  context.arcTo(x + width, y, x + width, y + height, r);
  context.arcTo(x + width, y + height, x, y + height, r);
  context.arcTo(x, y + height, x, y, r);
  context.arcTo(x, y, x + width, y, r);
  context.closePath();
}

function wrapText(context, text, x, y, maxWidth, lineHeight) {
  if (!text) {
    return;
  }
  const words = text.split(" ");
  let line = "";
  let offsetY = 0;
  words.forEach((word, index) => {
    const testLine = line + word + " ";
    const { width } = context.measureText(testLine);
    if (width > maxWidth && index > 0) {
      context.fillText(line, x, y + offsetY);
      line = word + " ";
      offsetY += lineHeight;
    } else {
      line = testLine;
    }
  });
  context.fillText(line, x, y + offsetY);
}

function formatValue(value) {
  if (Number.isNaN(value)) {
    return "-";
  }
  return Intl.NumberFormat("pt-BR").format(value);
}

function getMetricAtPosition(x, y) {
  return metrics.find((metric) =>
    x >= metric.x &&
    x <= metric.x + metric.width &&
    y >= metric.y &&
    y <= metric.y + metric.height
  );
}

function updateEditForm(metric) {
  if (!metric) {
    editForm.classList.add("hidden");
    emptyState.classList.remove("hidden");
    return;
  }

  editForm.classList.remove("hidden");
  emptyState.classList.add("hidden");
  editForm.elements.id.value = metric.id;
  editForm.elements.title.value = metric.title;
  editForm.elements.value.value = metric.value;
  editForm.elements.unit.value = metric.unit;
  editForm.elements.context.value = metric.context;
  editForm.elements.notes.value = metric.notes;
}

function selectMetric(metric) {
  selectedId = metric ? metric.id : null;
  updateEditForm(metric);
  draw();
}

function handleMouseDown(event) {
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  const metric = getMetricAtPosition(x, y);
  if (metric) {
    selectMetric(metric);
    dragTarget = metric;
    dragOffset = { x: x - metric.x, y: y - metric.y };
  } else {
    selectMetric(null);
  }
}

function handleMouseMove(event) {
  if (!dragTarget) {
    return;
  }
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  dragTarget.x = Math.max(8, Math.min(x - dragOffset.x, rect.width - dragTarget.width - 8));
  dragTarget.y = Math.max(8, Math.min(y - dragOffset.y, rect.height - dragTarget.height - 8));
  draw();
}

function handleMouseUp() {
  dragTarget = null;
}

metricForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(metricForm));
  const metric = createMetric(data);
  metricForm.reset();
  selectMetric(metric);
  draw();
});

editForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(editForm));
  const metric = metrics.find((item) => item.id === data.id);
  if (!metric) {
    return;
  }
  metric.title = data.title;
  metric.value = Number(data.value);
  metric.unit = data.unit;
  metric.context = data.context;
  metric.notes = data.notes;
  draw();
});

deleteMetricButton.addEventListener("click", () => {
  if (!selectedId) {
    return;
  }
  metrics = metrics.filter((metric) => metric.id !== selectedId);
  selectedId = null;
  updateEditForm(null);
  draw();
});

resetLayoutButton.addEventListener("click", () => {
  metrics.forEach((metric, index) => {
    const columns = Math.max(
      1,
      Math.floor(
        (canvas.getBoundingClientRect().width - layoutDefaults.startX) /
          (layoutDefaults.width + layoutDefaults.gap)
      )
    );
    const col = index % columns;
    const row = Math.floor(index / columns);
    metric.x = layoutDefaults.startX + col * (layoutDefaults.width + layoutDefaults.gap);
    metric.y = layoutDefaults.startY + row * (layoutDefaults.height + layoutDefaults.gap);
  });
  draw();
});

canvas.addEventListener("mousedown", handleMouseDown);
canvas.addEventListener("mousemove", handleMouseMove);
canvas.addEventListener("mouseup", handleMouseUp);
canvas.addEventListener("mouseleave", handleMouseUp);

window.addEventListener("resize", resizeCanvas);

metrics = defaultMetrics.map((metric) => createMetric(metric));
resizeCanvas();
selectMetric(metrics[0]);
