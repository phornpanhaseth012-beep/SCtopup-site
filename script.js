const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];
const catalog = {
  "Mobile Legends: Bang Bang": [
    {name:"86 Diamonds", price:3.00}, {name:"172 Diamonds", price:5.80},
    {name:"257 Diamonds", price:8.50}, {name:"Weekly Pass", price:2.20}
  ],
  "Free Fire": [
    {name:"100 Diamonds", price:1.00}, {name:"310 Diamonds", price:3.00},
    {name:"520 Diamonds", price:5.00}, {name:"1060 Diamonds", price:10.00}
  ]
};
let selectedPrice = 3.00;

function money(price) { return "$" + Number(price).toFixed(2); }
function updatePackages() {
  const game = $("#game").value;
  const packageSelect = $("#package");
  packageSelect.innerHTML = "";
  catalog[game].forEach((item) => {
    const option = document.createElement("option");
    option.value = item.name;
    option.textContent = `${item.name} — ${money(item.price)}`;
    option.dataset.price = item.price;
    packageSelect.appendChild(option);
  });
  updateTotal();
}
function updateTotal() {
  const option = $("#package").selectedOptions[0];
  selectedPrice = option ? Number(option.dataset.price) : 0;
  $("#total").textContent = money(selectedPrice);
}
$("#game").addEventListener("change", updatePackages);
$("#package").addEventListener("change", updateTotal);
updatePackages();
$("#year").textContent = new Date().getFullYear();

$$(".packages").forEach((group) => {
  group.querySelectorAll(".package").forEach((button) => {
    button.addEventListener("click", () => {
      group.querySelectorAll(".package").forEach((item) => item.classList.remove("active"));
      button.classList.add("active");
      const gameName = group.dataset.game === "mlbb" ? "Mobile Legends: Bang Bang" : "Free Fire";
      $("#game").value = gameName;
      updatePackages();
      $("#package").value = button.dataset.name;
      updateTotal();
    });
  });
});
$$(".choose-game").forEach((button) => {
  button.addEventListener("click", () => {
    $("#game").value = button.dataset.game === "mlbb" ? "Mobile Legends: Bang Bang" : "Free Fire";
    updatePackages();
    const group = document.querySelector(`.packages[data-game="${button.dataset.game}"]`);
    const active = group.querySelector(".package.active");
    if (active) $("#package").value = active.dataset.name;
    updateTotal();
    $("#order").scrollIntoView({behavior:"smooth"});
  });
});

$("#orderForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const game = $("#game").value;
  const pack = $("#package").value;
  const playerId = $("#playerId").value.trim();
  const server = $("#server").value.trim();
  const contact = $("#contact").value.trim();
  const payment = $("#payment").value;
  const message = [
    "SC GAMING — ORDER REQUEST",
    "-------------------------",
    `Game: ${game}`,
    `Package: ${pack}`,
    `Example price: ${money(selectedPrice)}`,
    `Player ID: ${playerId}`,
    `Server / Region: ${server || "Not provided"}`,
    `Customer contact: ${contact}`,
    `Payment method: ${payment}`,
    "",
    "Please confirm package availability, final price, and official payment details before I pay."
  ].join("\\n");
  $("#orderMessage").value = message;
  $("#orderOutput").hidden = false;
  $("#orderOutput").scrollIntoView({behavior:"smooth", block:"nearest"});
});
$("#copyOrder").addEventListener("click", async () => {
  const text = $("#orderMessage").value;
  try {
    await navigator.clipboard.writeText(text);
    $("#copyOrder").textContent = "Copied!";
    setTimeout(() => $("#copyOrder").textContent = "Copy order message", 1600);
  } catch {
    $("#orderMessage").focus();
    $("#orderMessage").select();
    document.execCommand("copy");
    $("#copyOrder").textContent = "Copy attempted — check clipboard";
  }
});
$("#menuToggle").addEventListener("click", () => $("#mainNav").classList.toggle("open"));
$("#mainNav").querySelectorAll("a").forEach((link) => link.addEventListener("click", () => $("#mainNav").classList.remove("open")));
