import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import "./react.css";

const scripts = [
  {
    title: "Spoofing Discord Quest",
    searchTitle: "Discord Auto Quest",
    type: "Auto Quest Script",
    status: "Work",
    version: "v1.2",
    tag: "Discord Quest",
    tagTone: "",
    description:
      "Auto Discord quest no need to download the application required by discord safe and clean BYPASS",
    actionHref: "https://discord.com/channels/@me",
    actionLabel: "Open Discord",
    code: `delete window.$;
let wpRequire = webpackChunkdiscord_app.push([[Symbol()], {}, r => r]);
webpackChunkdiscord_app.pop();

let ApplicationStreamingStore = Object.values(wpRequire.c).find(x => x?.exports?.A?.__proto__?.getStreamerActiveStreamMetadata).exports.A;
let RunningGameStore = Object.values(wpRequire.c).find(x => x?.exports?.Ay?.getRunningGames).exports.Ay;
let QuestsStore = Object.values(wpRequire.c).find(x => x?.exports?.A?.__proto__?.getQuest).exports.A;
let ChannelStore = Object.values(wpRequire.c).find(x => x?.exports?.A?.__proto__?.getAllThreadsForParent).exports.A;
let GuildChannelStore = Object.values(wpRequire.c).find(x => x?.exports?.Ay?.getSFWDefaultChannel).exports.Ay;
let FluxDispatcher = Object.values(wpRequire.c).find(x => x?.exports?.h?.__proto__?.flushWaitQueue).exports.h;
let api = Object.values(wpRequire.c).find(x => x?.exports?.Bo?.get).exports.Bo;

const supportedTasks = ["WATCH_VIDEO", "PLAY_ON_DESKTOP", "STREAM_ON_DESKTOP", "PLAY_ACTIVITY", "WATCH_VIDEO_ON_MOBILE"];
let quests = [...QuestsStore.quests.values()].filter(x => x.userStatus?.enrolledAt && !x.userStatus?.completedAt && new Date(x.config.expiresAt).getTime() > Date.now() && supportedTasks.find(y => Object.keys((x.config.taskConfig ?? x.config.taskConfigV2).tasks).includes(y)));
let isApp = typeof DiscordNative !== "undefined";

if (quests.length === 0) {
  console.log("You don't have any uncompleted quests!");
} else {
  let doJob = function() {
    const quest = quests.pop();
    if (!quest) return;

    const pid = Math.floor(Math.random() * 30000) + 1000;
    const applicationId = quest.config.application.id;
    const applicationName = quest.config.application.name;
    const questName = quest.config.messages.questName;
    const taskConfig = quest.config.taskConfig ?? quest.config.taskConfigV2;
    const taskName = supportedTasks.find(x => taskConfig.tasks[x] != null);
    const secondsNeeded = taskConfig.tasks[taskName].target;
    let secondsDone = quest.userStatus?.progress?.[taskName]?.value ?? 0;

    if (taskName === "WATCH_VIDEO" || taskName === "WATCH_VIDEO_ON_MOBILE") {
      const maxFuture = 10, speed = 7, interval = 1;
      const enrolledAt = new Date(quest.userStatus.enrolledAt).getTime();
      let completed = false;
      let fn = async () => {
        while (true) {
          const maxAllowed = Math.floor((Date.now() - enrolledAt) / 1000) + maxFuture;
          const diff = maxAllowed - secondsDone;
          const timestamp = secondsDone + speed;
          if (diff >= speed) {
            const res = await api.post({ url: \`/quests/\${quest.id}/video-progress\`, body: { timestamp: Math.min(secondsNeeded, timestamp + Math.random()) } });
            completed = res.body.completed_at != null;
            secondsDone = Math.min(secondsNeeded, timestamp);
          }

          if (timestamp >= secondsNeeded) break;
          await new Promise(resolve => setTimeout(resolve, interval * 1000));
        }

        if (!completed) {
          await api.post({ url: \`/quests/\${quest.id}/video-progress\`, body: { timestamp: secondsNeeded } });
        }
        console.log("Quest completed!");
        doJob();
      };
      fn();
      console.log(\`Spoofing video for \${questName}.\`);
    } else {
      console.log(\`Selected task: \${taskName} for \${applicationName}. Use Discord desktop app if required.\`);
    }
  };
  doJob();
}`,
    tutorial: `1. Script berhasil disalin.
2. Buka Discord dan pencet quest mana yang ingin dikerjakan lalu
3. Buka Console Discord dengan cara klik CTRL + SHIFT + I.
4. Pergi ke tab "Console" Lalu abaikan tulisan "HOLD UP dll"
5. Kalau muncul seperti tulisan ketik aja "allow pasting".
6. Lalu copy script yang tadi ke console tersebut.
7. Selesai.`,
  },
  {
    title: "CDID Autofarm Logic",
    searchTitle: "AutoFarm Logic CDID",
    type: "AutoFarm CDID",
    status: "Work",
    version: "LUA",
    tag: "PRESET",
    tagTone: "teal",
    description: "CDID Autofarm preset for bypass system in Roblox Studio",
    code: `-- ======= AUTOFARM LOGIC MODULE =======

local AutoFarmLogic = {}

local Players = game:GetService("Players")
local RunService = game:GetService("RunService")

AutoFarmLogic.IsRunning = false
AutoFarmLogic.CurrentSpeed = 710
AutoFarmLogic.Player = Players.LocalPlayer

local PointA = CFrame.new(-18158.0664, 34.5178947, -454.243683, 0.89404887, -0.000757645816, 0.447968811, 6.20140418e-06, 0.999998569, 0.00167891255, -0.447969437, -0.0014982518, 0.894047618)
local PointB = CFrame.new(-34492.1211, 34.3485794, -32842.832, -0.934907079, 0.00187035452, -0.354887635, 0.000956334639, 0.999995768, 0.0027509057, 0.35489127, 0.00223244983, -0.934904933)

local heartbeatConn = nil
local wasInFront = nil
local justTeleported = false
local currentTarget = PointB
local printTimer = 0

local function teleportVehicle(targetCFrame, vehicle)
  pcall(function()
    local chassis = vehicle.PrimaryPart
    if not chassis then return end

    chassis.Anchored = true
    pcall(function() vehicle:PivotTo(targetCFrame) end)
    pcall(function() vehicle:SetPrimaryPartCFrame(targetCFrame) end)
    chassis.CFrame = targetCFrame
    chassis.Velocity = Vector3.zero
    chassis.RotVelocity = Vector3.zero

    if chassis.AssemblyLinearVelocity then
      chassis.AssemblyLinearVelocity = Vector3.zero
      chassis.AssemblyAngularVelocity = Vector3.zero
    end

    wait(0.15)
    chassis.Anchored = false
  end)
end

function AutoFarmLogic:SetSpeed(speed)
  self.CurrentSpeed = math.clamp(speed, 100, 710)
end

function AutoFarmLogic:Start()
  if self.IsRunning then
    warn("AutoFarm already running!")
    return
  end

  self.IsRunning = true
  currentTarget = PointB
  wasInFront = nil
  justTeleported = false
  printTimer = 0

  heartbeatConn = RunService.Heartbeat:Connect(function(dt)
    if not self.IsRunning then return end

    pcall(function()
      printTimer = printTimer + dt
      local char = self.Player.Character
      if not char then return end

      local hum = char:FindFirstChild("Humanoid")
      if not hum then return end

      local seat = hum.SeatPart
      if not seat or not seat:IsA("VehicleSeat") then return end

      local vehicle = seat.Parent
      local chassis = vehicle.PrimaryPart
      if not chassis then return end

      local pos = chassis.Position
      local targetPos = currentTarget.Position
      local toTarget = targetPos - pos
      local flatDir = Vector3.new(toTarget.X, 0, toTarget.Z)

      if flatDir.Magnitude > 1 then
        flatDir = flatDir.Unit
        if chassis.AssemblyLinearVelocity then
          chassis.AssemblyLinearVelocity = flatDir * self.CurrentSpeed
        else
          chassis.Velocity = flatDir * self.CurrentSpeed
        end

        local targetCFrame = CFrame.lookAt(pos, pos + flatDir)
        chassis.CFrame = chassis.CFrame:Lerp(targetCFrame, 0.15)
      end

      local carForward = chassis.CFrame.LookVector
      local toTargetDir = toTarget.Unit
      local isInFront = carForward:Dot(toTargetDir) > 0

      if wasInFront == true and isInFront == false and not justTeleported then
        justTeleported = true
        local teleportTarget = (currentTarget == PointB) and PointB or PointA
        local nextTarget = (currentTarget == PointB) and PointA or PointB
        teleportVehicle(teleportTarget, vehicle)
        currentTarget = nextTarget
        wasInFront = nil
        task.delay(3, function()
          justTeleported = false
        end)
      end

      if wasInFront == nil and not justTeleported then
        wasInFront = isInFront
      elseif not justTeleported then
        wasInFront = isInFront
      end
    end)
  end)
end

function AutoFarmLogic:StopAutoDrive()
  if not self.IsRunning then
    warn("AutoFarm not running!")
    return
  end

  self.IsRunning = false

  if heartbeatConn then
    heartbeatConn:Disconnect()
    heartbeatConn = nil
  end

  wasInFront = nil
  justTeleported = false
end

AutoFarmLogic.Player.CharacterRemoving:Connect(function()
  if AutoFarmLogic.IsRunning then
    AutoFarmLogic:StopAutoDrive()
  end
end)

return AutoFarmLogic`,
    tutorial: `1. Script berhasil disalin.
2. Tempel script pada environment/executor yang sesuai.
3. Periksa konfigurasi sebelum menjalankan.
4. Maka Otomatiss selesai`,
  },
  {
    title: "Copy Clipboard Flow",
    searchTitle: "Copy Clipboard Flow",
    type: "Utility script",
    status: "Maintenance",
    version: "Flow",
    tag: "Utility",
    tagTone: "gold",
    description: "Pattern UI untuk tombol copy, toast feedback, dan fallback interaksi sederhana.",
    code: `async function copyScript(value) {
  await navigator.clipboard.writeText(value);

  return {
    status: "copied",
    message: "Script copied to clipboard"
  };
}`,
    tutorial: `1. Script berhasil disalin.
2. Tempel fungsi ke file JavaScript project kamu.
3. Sesuaikan nama fungsi dan feedback UI jika diperlukan.`,
  },
];

function App() {
  const [route, setRoute] = useState(() => normalizeRoute(window.location.pathname));
  const [activeFilter, setActiveFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [selectedScript, setSelectedScript] = useState(null);
  const [tutorialScript, setTutorialScript] = useState(null);
  const [copyState, setCopyState] = useState("idle");

  useEffect(() => {
    document.body.className = route === "connect" ? "connect-page" : route === "loading" ? "loading-page" : "library-page";
  }, [route]);

  useEffect(() => {
    const onPopState = () => setRoute(normalizeRoute(window.location.pathname));
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  useEffect(() => {
    if (route !== "loading") return undefined;
    const timer = window.setTimeout(() => navigate("scripts", setRoute, true), 6600);
    return () => window.clearTimeout(timer);
  }, [route]);

  useEffect(() => {
    document.body.style.overflow = selectedScript || tutorialScript ? "hidden" : "";
  }, [selectedScript, tutorialScript]);

  const filteredScripts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return scripts.filter((script) => {
      const matchesFilter = activeFilter === "all" || script.status.toLowerCase() === activeFilter;
      const searchText = [
        script.searchTitle,
        script.type,
        script.status,
        script.tag,
        script.title,
        script.description,
      ]
        .join(" ")
        .toLowerCase();

      return matchesFilter && (!normalizedQuery || searchText.includes(normalizedQuery));
    });
  }, [activeFilter, query]);

  const openScript = (script) => {
    setSelectedScript(script);
    setCopyState("idle");
  };

  const closeScript = () => {
    setSelectedScript(null);
    setCopyState("idle");
  };

  const copyScript = async () => {
    if (!selectedScript) return;

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(selectedScript.code);
      } else {
        const fallback = document.createElement("textarea");
        fallback.value = selectedScript.code;
        fallback.setAttribute("readonly", "");
        fallback.style.position = "fixed";
        fallback.style.opacity = "0";
        document.body.appendChild(fallback);
        fallback.select();
        document.execCommand("copy");
        fallback.remove();
      }

      setCopyState("copied");
      window.setTimeout(() => setCopyState("done"), 580);
      window.setTimeout(() => {
        setTutorialScript(selectedScript);
        setSelectedScript(null);
        setCopyState("idle");
      }, 940);
    } catch {
      setCopyState("failed");
    }
  };

  if (route === "loading") {
    return <LoadingPage />;
  }

  if (route === "connect") {
    return <ConnectPage setRoute={setRoute} />;
  }

  return (
    <>
      <LibraryPage
        activeFilter={activeFilter}
        filteredScripts={filteredScripts}
        onFilterChange={setActiveFilter}
        onOpenScript={openScript}
        query={query}
        setQuery={setQuery}
        setRoute={setRoute}
      />
      <ScriptModal
        copyState={copyState}
        onClose={closeScript}
        onCopy={copyScript}
        script={selectedScript}
      />
      <TutorialModal onClose={() => setTutorialScript(null)} script={tutorialScript} />
    </>
  );
}

function normalizeRoute(pathname) {
  if (pathname === "/" || pathname === "/loading") return "loading";
  if (pathname === "/connect") return "connect";
  return "scripts";
}

function navigate(route, setRoute, replace = false) {
  const path = route === "connect" ? "/connect" : route === "loading" ? "/" : "/scripts";
  window.history[replace ? "replaceState" : "pushState"]({}, "", path);
  setRoute(route);
}

function Chrome({ children }) {
  return (
    <>
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />
      <div className="noise" />
      {children}
    </>
  );
}

function Navbar({ active, setRoute }) {
  const [isHidden, setIsHidden] = useState(false);

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const onScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY < 0) return; // Mengabaikan efek pantulan (bounce) pada iOS/Safari

      const isScrollingDown = currentScrollY > lastScrollY;

      // Sembunyikan jika scroll ke bawah dan sudah melewati 60px (threshold)
      setIsHidden(currentScrollY > 60 && isScrollingDown);
      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className={`navbar ${isHidden ? "is-hidden" : ""}`}>
      <a
        href="/scripts"
        className="brand"
        aria-label="ClarityX home"
        onClick={(event) => {
          event.preventDefault();
          navigate("scripts", setRoute);
        }}
      >
        <span className="brand-mark">
          <img src="/assets/logoclarity.jpg" alt="ClarityX logo" />
        </span>
        <span>ClarityX</span>
      </a>

      <div className="nav-actions" aria-label="Main navigation">
        <a
          href="/scripts"
          className={`nav-link ${active === "scripts" ? "active" : ""}`}
          onClick={(event) => {
            event.preventDefault();
            navigate("scripts", setRoute);
          }}
        >
          Scripts
        </a>
        <a
          href="/connect"
          className={`nav-link ${active === "connect" ? "active" : ""}`}
          onClick={(event) => {
            event.preventDefault();
            navigate("connect", setRoute);
          }}
        >
          Connect
        </a>
      </div>

      <div className="nav-status">
        <span className="status-dot" />
        Online
      </div>
    </nav>
  );
}

function LibraryPage({ activeFilter, filteredScripts, onFilterChange, onOpenScript, query, setQuery, setRoute }) {
  return (
    <Chrome>
      <aside className="notice-bubble" aria-label="Notification">
        <span className="notice-pulse" />
        <div>
          <strong>Notice</strong>
          <p>Aktifkan dev mode Discord sebelum membuka console script.</p>
        </div>
      </aside>

      <main className="app-shell">
        <Navbar active="scripts" setRoute={setRoute} />
        <Hero />

        <section className="library-section" aria-label="Script library">
          <div className="section-heading">
            <div>
              <span className="eyebrow">Library</span>
              <h2 id="library-title">Script collection</h2>
            </div>
            <p id="library-desc"></p>
          </div>

          <div className="library-toolbar">
            <label className="search-shell" aria-label="Search scripts">
              <span className="search-icon" />
              <input
                id="script-search"
                type="search"
                placeholder="Search script..."
                autoComplete="off"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </label>
            <div className="filter-pills">
              {["all", "work", "maintenance"].map((filter) => (
                <button
                  className={`filter-pill ${activeFilter === filter ? "active" : ""}`}
                  key={filter}
                  type="button"
                  onClick={() => onFilterChange(filter)}
                >
                  {filter === "all" ? "All" : filter[0].toUpperCase() + filter.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="script-grid" id="script-grid">
            {filteredScripts.map((script, index) => (
              <ScriptCard key={script.title} onOpen={() => onOpenScript(script)} script={script} style={{ "--motion-order": index }} />
            ))}
          </div>

          <div className="empty-state" id="empty-state" hidden={filteredScripts.length > 0}>
            <strong>No scripts found</strong>
            <p>Try a different keyword or filter.</p>
          </div>
        </section>
      </main>
    </Chrome>
  );
}

function Hero() {
  return (
    <section className="hero">
      <div className="hero-copy">
        <span className="eyebrow"> Archive Script</span>
        <h1>This Is ClarityX</h1>
        <p>ClarityX is a Side Project of @exotickic or drx347 on github</p>

        <div className="hero-stats" aria-label="Library stats">
          <div>
            <strong>03</strong>
            <span>Total Script</span>
          </div>
          <div>
            <strong>02</strong>
            <span>Active</span>
          </div>
          <div>
            <strong>01</strong>
            <span>Maintenance</span>
          </div>
        </div>
      </div>

      <div className="editor-panel code-vault" aria-label="Code preview">
        <div className="code-seal" aria-hidden="true">
          <span>CX</span>
        </div>
        <div className="editor-top">
          <div className="editor-tabs">
            <span className="active-tab">loader.js</span>
            <span>usage.md</span>
          </div>
          <span className="editor-pill">ready</span>
        </div>

        <pre className="code-block">
          <code>
            <span className="ln">01</span>
            <span className="code-key">const</span> clarity = <span className="code-fn">createLibrary</span>({"{"}
            {"\n"}
            <span className="ln">02</span> mode: <span className="code-string">"secure"</span>,{"\n"}
            <span className="ln">03</span> theme: <span className="code-string">"edgy-dark"</span>,{"\n"}
            <span className="ln">04</span> copyButton: <span className="code-bool">true</span>
            {"\n"}
            <span className="ln">05</span>
            {"});\n"}
            <span className="ln">06</span>
            {"\n"}
            <span className="ln">07</span>
            <span className="code-fn">clarity</span>.<span className="code-fn">mount</span>(<span className="code-string">"#script-grid"</span>);
          </code>
        </pre>
      </div>
    </section>
  );
}

function ScriptCard({ onOpen, script, style }) {
  return (
    <article className="script-card is-entering" style={style}>
      <div className="card-meta">
        <span className={`script-tag ${script.tagTone}`}>{script.tag}</span>
        <div className="meta-group">
          <span className={`status-badge ${script.status.toLowerCase()}`}>{script.status}</span>
          <span>{script.version}</span>
        </div>
      </div>
      <h3>{script.title}</h3>
      <p>{script.description}</p>
      <div className="card-actions">
        <button className="gradient-button" type="button" onClick={onOpen}>
          Open Script
        </button>
        {script.actionHref ? (
          <a className="secondary-button" href={script.actionHref} target="_blank" rel="noreferrer">
            {script.actionLabel}
          </a>
        ) : null}
      </div>
    </article>
  );
}

function ScriptModal({ copyState, onClose, onCopy, script }) {
  if (!script) return null;

  return (
    <div className={`script-modal is-open ${copyState === "copied" ? "is-copying" : ""} ${copyState === "done" ? "is-copying is-tutorial is-done" : ""}`} aria-hidden="false">
      <div className="modal-backdrop" onClick={onClose} />
      <section className="modal-panel" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <div className="modal-header">
          <div>
            <div className="modal-meta-line">
              <span className="modal-kicker" id="modal-type">
                {script.type}
              </span>
              <span className={`status-badge ${script.status.toLowerCase()}`} id="modal-status">
                {script.status}
              </span>
            </div>
            <h2 id="modal-title">{script.title}</h2>
          </div>
          <button className="icon-button" type="button" onClick={onClose} aria-label="Close modal">
            &times;
          </button>
        </div>

        <div className="modal-flow" aria-label="Script flow">
          {["Review", "Copy", "Tutorial", "Done"].map((step, index) => (
            <React.Fragment key={step}>
              <div className={`flow-step ${index === 0 ? "is-active" : ""}`}>
                <span>{index + 1}</span>
                <strong>{step}</strong>
              </div>
              {index < 3 ? <div className="flow-line" /> : null}
            </React.Fragment>
          ))}
        </div>

        <div className="modal-code-shell">
          <div className="modal-code-top">
            <div className="file-chip">
              <span className="file-dot" />
              <span>script.js</span>
            </div>
            <button className={`copy-button ${copyState !== "idle" ? "is-copied" : ""}`} type="button" onClick={onCopy}>
              <span className="copy-label">{copyState === "failed" ? "Copy failed" : copyState === "idle" ? "Copy Script" : copyState === "done" ? "Done" : "Copied"}</span>
            </button>
          </div>
          <pre className="modal-code">
            <code id="modal-code">{script.code}</code>
          </pre>
        </div>

        <div className="modal-footer">
          <span>After copying, the guide opens automatically.</span>
          <button className="ghost-button" type="button" onClick={onClose}>
            Close
          </button>
        </div>
      </section>
    </div>
  );
}

function TutorialModal({ onClose, script }) {
  if (!script) return null;

  return (
    <div className="tutorial-modal is-open" aria-hidden="false">
      <div className="modal-backdrop" onClick={onClose} />
      <section className="modal-panel tutorial-panel" role="dialog" aria-modal="true" aria-labelledby="tutorial-title">
        <div className="modal-header">
          <div>
            <div className="modal-meta-line">
              <span className="modal-kicker">Usage note</span>
              <span className="status-badge work">Copied</span>
            </div>
            <h2 id="tutorial-title">Tutorial: {script.title}</h2>
          </div>
          <button className="icon-button" type="button" onClick={onClose} aria-label="Close tutorial">
            &times;
          </button>
        </div>

        <div className="tutorial-body">
          <pre className="tutorial-text" id="tutorial-content">
            {script.tutorial}
          </pre>
        </div>

        <div className="modal-footer">
          <span>Have a Question?Click "Connect" on top bar:v</span>
          <button className="ghost-button" type="button" onClick={onClose}>
            Done
          </button>
        </div>
      </section>
    </div>
  );
}

function ConnectPage({ setRoute }) {
  return (
    <Chrome>
      <aside className="notice-bubble" aria-label="Notification">
        <span className="notice-pulse" />
        <div>
          <strong>Notice</strong>
          <p>Donate agar atmin semangat membuat dan update scriptnya:p</p>
        </div>
      </aside>

      <main className="app-shell connect-shell">
        <Navbar active="connect" setRoute={setRoute} />
        <section className="connect-section" aria-label="Connect with ClarityX owner">
          <div className="connect-copy">
            <span className="eyebrow">Official contact</span>
            <h1>Creator Ingfooo.</h1>
            <p>Join Discord A7OMIC atau hubungi owner untuk update, status script, dan request.</p>
          </div>

          <div className="connect-grid">
            <ConnectCard
              buttonClass="discord-button"
              href="https://discord.gg/getsades"
              image="/assets/comunn.png"
              imageAlt="ClarityX community icon"
              label="Community Server"
              title="A70MIC Discord"
              text="Tempat update script, maintenance info, dan announcement A7OMIC."
              buttonText="Join Discord"
              primary
            />
            <ConnectCard
              href="https://discord.com/users/975269168184168539"
              image="/assets/chat.jpeg"
              imageAlt="ClarityX owner Discord icon"
              label="Owner Discord"
              title="@exotickic"
              text="ClarityX Owner"
              buttonText="Open Profile"
            />
            <ConnectCard
              href="https://saweria.co/draxxyzz"
              image="/assets/saweria.jpg"
              imageAlt="Saweria support icon"
              label="Support Creator"
              title="Saweria"
              text="Dukung project ClarityX lewat Saweria kalau kamu suka dengan script library ini."
              buttonText="Open Saweria"
            />
          </div>
        </section>
      </main>
    </Chrome>
  );
}

function ConnectCard({ buttonClass = "ghost-connect-button", buttonText, href, image, imageAlt, label, primary = false, text, title }) {
  return (
    <article className={`connect-card ${primary ? "primary-connect" : ""}`}>
      <div className={`connect-mark image-mark ${primary ? "" : "subtle-mark"}`}>
        <img src={image} alt={imageAlt} />
      </div>
      <span className="connect-label">{label}</span>
      <h2>{title}</h2>
      <p>{text}</p>
      <a className={buttonClass} href={href} target="_blank" rel="noreferrer">
        {buttonText}
      </a>
    </article>
  );
}

function LoadingPage() {
  return (
    <Chrome>
      <section className="entry-gate" aria-label="Verification screen">
        <div className="terminal-card">
          <div className="terminal-bar">
            <span />
            <span />
            <span />
          </div>

          <div className="terminal-body">
            <p className="terminal-line line-one">
              <span className="prompt">CX:</span> Initializing ClarityX<span className="dots" />
            </p>
            <p className="terminal-line line-two">
              <span className="prompt">SYS:</span> Verifying access<span className="dots delay" />
            </p>
            <div className="terminal-loader" aria-label="Loading progress">
              <div className="loader-meta">
                <span>Loading modules</span>
                <span className="loader-percent" />
              </div>
              <div className="loader-track">
                <span className="loader-fill" />
              </div>
            </div>
            <p className="terminal-line line-three granted">
              <span className="prompt">CX:</span> Access Granted<span className="cursor" />
            </p>
          </div>
        </div>
      </section>
    </Chrome>
  );
}

createRoot(document.getElementById("root")).render(<App />);
