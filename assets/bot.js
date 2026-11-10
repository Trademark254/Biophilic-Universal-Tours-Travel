/* Ask Biophilic: a free helper that answers from this website's own text. It runs in the browser, needs no server, and
   hands anything it cannot answer (prices, availability, bookings) to the team on WhatsApp. */
(function () {
  if (document.getElementById("botFab")) return;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var PH = (typeof CONTACT !== "undefined") ? CONTACT.phone : "+254 745 734 823";
  var PHRAW = (typeof CONTACT !== "undefined") ? CONTACT.phoneRaw : "+254745734823";
  var EM = (typeof CONTACT !== "undefined") ? CONTACT.email : "info@biophilictours.com";
  var NUM = PHRAW.replace("+", "");
  var base = ""; /* pages sit side by side, so links are relative */
  function L(href, text) { return '<a href="' + href + '">' + text + "</a>"; }

  /* ---------- what the helper knows (taken from the site's own pages) ---------- */
  var KB = [
    { id: "bookflow", t: "Book a trip", flow: true, a: "",
      k: ["book a trip", "book now", "make a booking", "i want to book", "i would like to book", "book a safari", "book a stay", "book a car", "book a transfer", "book for me", "help me book", "booking form", "reserve now", "start booking", "how do i book", "how can i book"],
      c: [] },
    { id: "hello", t: "Hello", k: ["hello", "hi", "hey", "good morning", "good afternoon", "good evening", "jambo", "habari", "start", "help"],
      a: "Hello. I am an automated helper for Biophilic Universal Tours &amp; Travels. I answer from what is on this website. For prices, availability and bookings, our team replies on WhatsApp.",
      c: ["bookflow", "services", "routes"] },
    { id: "about", t: "About the company", k: ["about us", "about you", "about the company", "who are you", "who is biophilic", "company", "biophilic", "biophilia", "your name", "story", "background", "history", "how long have you"],
      a: "Biophilic Universal Tours &amp; Travels Ltd is a Kenyan travel company based in Nairobi. One team plans your route, your stay and your vehicle, and sends you one clear quotation. Biophilia means a love of living things, and we apply it by leaving room to watch, walk and sit still. " + L("about.html", "Read more about us") + ".",
      c: ["services", "booking", "trust"] },
    { id: "services", t: "What do you offer?", k: ["offer", "service", "what do you do", "what can you do", "provide", "do you do", "everything", "packages", "package", "tours", "travel"],
      a: "We plan and book: " + L("safaris.html", "Safaris") + ", " + L("experiences.html", "Experiences") + ", " + L("transfers.html", "Transfers") + ", " + L("car-hire.html", "Car hire") + " and " + L("stays.html", "Stays") + " (lodges, tented camps, beach hotels, BnBs and apartments). You deal with one planner for the route, the stay and the vehicle.",
      c: ["safaris", "carhire", "stays"] },
    { id: "safaris", t: "Safaris", k: ["safari", "safaris", "game drive", "game drives", "wildlife", "animals", "big five", "park", "parks", "reserve", "national park", "wildebeest"],
      a: "We plan road safaris, fly-in safaris and multi-park trips to Kenya's parks, from one night to a full circuit. We design the route and arrange the lodges and the vehicle, and send one clear quotation. " + L("safaris.html", "Safaris page") + ".",
      c: ["routes", "seasons", "days"] },
    { id: "routes", t: "Sample routes", k: ["route", "routes", "itinerary", "itineraries", "sample", "trip ideas", "ideas", "suggest", "suggestion", "where should", "recommend"],
      a: "Some starting points: Tsavo East Short Break (2 days, 1 night), Masai Mara Fly-in (3 days, 2 nights), Amboseli and Tsavo (4 days, 3 nights), Rift Valley Lakes (3 days, 2 nights), Samburu in the North (4 days, 3 nights) and Nairobi to the Coast (7 days, 6 nights). We change the parks, the length and the lodges to suit your group. " + L("index.html#safaris", "See the routes") + ".",
      c: ["price", "days", "mara"], wa: "I am interested in one of your sample routes." },
    { id: "mara", t: "Masai Mara", k: ["mara", "masai mara", "maasai mara", "migration", "river crossing", "crossing", "big cats", "lion", "lions"],
      a: "Masai Mara is open grassland with scattered acacia, known for big cats, elephants and large herds. From about July to October, wildebeest and zebra from the Serengeti usually cross into the Mara. The timing changes every year, so we cannot promise it for any date. Early morning and late afternoon are usually the best hours for game drives.",
      c: ["seasons", "routes", "price"] },
    { id: "amboseli", t: "Amboseli", k: ["amboseli", "kilimanjaro", "elephants", "elephant"],
      a: "Amboseli is known for large elephant herds and for views of Mount Kilimanjaro across the border in Tanzania. Clouds often cover the mountain by mid-morning, so clear views are most likely at dawn and dusk.",
      c: ["routes", "seasons", "price"] },
    { id: "tsavo", t: "Tsavo", k: ["tsavo", "red elephants", "red earth", "tsavo east", "tsavo west"],
      a: "Together the two Tsavo parks cover a very large area. Tsavo East is mostly open plains with red soil, and its elephants often look red from dust-bathing. Tsavo West has more hills, lava rock and springs. The distances are long, so we suggest more nights here.",
      c: ["routes", "days", "price"] },
    { id: "samburu", t: "Samburu", k: ["samburu", "north", "northern", "grevy", "gerenuk", "oryx", "reticulated"],
      a: "Samburu is dry country in the north, along the Ewaso Ng'iro river. Several animals seen here are rarely found in the southern parks, including Grevy's zebra, reticulated giraffe, gerenuk and Beisa oryx. It is a long way from Nairobi, so it suits a trip with enough days.",
      c: ["routes", "days", "price"] },
    { id: "lakes", t: "Nakuru and Naivasha", k: ["nakuru", "naivasha", "lake", "lakes", "rift valley", "flamingo", "flamingos", "rhino", "rhinos", "hippo", "hippos", "birds", "birdlife"],
      a: "Lake Nakuru is known for birdlife and for rhino, in a park built around a soda lake. Lake Naivasha is a freshwater lake with hippo and birds, and boat trips and walks along the shore are common. Both are in the Rift Valley, within a day's drive of Nairobi, so they suit shorter trips.",
      c: ["routes", "days", "price"] },
    { id: "seasons", t: "Best time to go", k: ["when", "best time", "good time", "when to go", "when should i go", "time to go", "time to visit", "season", "seasons", "weather", "rain", "rains", "rainy", "dry season", "month", "months", "time of year", "climate", "january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december", "peak"],
      a: "Kenya sits on the equator, so the year is divided by rain, not by cold and heat. June to October is the long dry season: grass is shorter, animals gather near water, and it is the busiest time. November and December bring short rains and fewer visitors. January and February are warm and dry. March to May are the long rains: green and quiet, with lower rates at some lodges, some muddy roads and a few closed camps. Weather varies, so we advise for your dates.",
      c: ["days", "mara", "price"] },
    { id: "days", t: "How many days?", k: ["how many days", "how long", "days", "duration", "length", "how many nights", "nights", "short trip", "weekend", "week"],
      a: "Many first-time visitors find three to five days works well for one or two parks. More parks mean more driving, so we suggest fewer parks and longer looks. Tell us your dates and we suggest what fits.",
      c: ["routes", "price", "booking"], wa: "I would like help choosing how many days I need." },
    { id: "packing", t: "What to pack", k: ["pack", "packing", "what to bring", "wear", "clothes", "clothing", "luggage", "what to take", "binoculars"],
      a: "Light layers in neutral colours, a hat, sunscreen, insect repellent, binoculars, a camera, a warm layer for early mornings and your passport or ID. We send a full list after you confirm."
      , c: ["seasons", "booking", "contact"] },
    { id: "parkfees", t: "Park fees", k: ["park fee", "park fees", "entry fee", "entry fees", "gate fee", "included", "include", "includes", "excluded", "extra", "what is included", "inclusive"],
      a: "Park entry fees are charged per person and differ by park and season. Your quotation says whether they are included or extra, and lists what is included and what costs extra.",
      c: ["price", "booking", "contact"] },
    { id: "experiences", t: "Experiences", k: ["experience", "experiences", "sundowner", "sundowners", "walk", "walks", "nature walk", "village", "villages", "cultural", "culture", "boat", "boat trip", "city day", "activities", "activity", "things to do"],
      a: "Experiences can be added to any route: sundowners, nature walks, village visits, boat trips or a city day. Details vary by place and season, and we confirm them when we quote. " + L("experiences.html", "Experiences page") + ".",
      c: ["safaris", "price", "children"] },
    { id: "transfers", t: "Transfers", k: ["transfer", "transfers", "pick up", "pickup", "pick-up", "drop off", "dropoff", "drop-off", "airport", "airports", "jkia", "shuttle", "lift", "coach", "minibus", "meet"],
      a: "We arrange pick-ups and drop-offs at airports, hotels, park gates and the coast, for one person or a coach load. Send us your flight number and arrival time so the pick-up can be timed, plus how many people and bags are travelling. " + L("transfers.html", "Transfers page") + ".",
      c: ["price", "carhire", "contact"], wa: "I would like to book a transfer." },
    { id: "carhire", t: "Car hire", k: ["car", "cars", "hire", "rent", "rental", "vehicle", "vehicles", "van", "vans", "4x4", "four wheel", "four-wheel", "saloon", "driver", "land cruiser", "cruiser"],
      a: "You can hire saloon cars, safari vans and four-wheel-drive vehicles, by the day or for the whole trip. Vehicles come with a driver who knows the roads, so you can watch, rest and not navigate. " + L("car-hire.html", "Car hire page") + ".",
      c: ["price", "transfers", "contact"], wa: "I would like to hire a vehicle." },
    { id: "stays", t: "Stays and BnBs", k: ["stay", "stays", "accommodation", "hotel", "hotels", "lodge", "lodges", "camp", "camps", "tent", "tented", "bnb", "bnbs", "apartment", "apartments", "airbnb", "sleep", "room", "rooms", "beach", "diani", "coast", "mombasa", "resort"],
      a: "We book lodges and tented camps in the parks, beach hotels on the coast, and BnBs and apartments in towns, matched to your route, season and budget. Many safari lodges include meals, while a BnB may include only the room. Your quotation says what is included. " + L("stays.html", "Stays page") + ".",
      c: ["price", "children", "contact"], wa: "I would like help finding a place to stay." },
    { id: "booking", t: "How booking works", k: ["book", "booking", "how do i", "how to", "reserve", "reservation", "process", "steps", "confirm", "quotation", "quote"],
      a: "Four steps: 1) Tell us your plan: dates, places, group size and anything you must see. 2) We check availability of routes, lodges and vehicles. 3) You get a written quotation showing what is included and what costs extra. 4) After you confirm, we book each service and stay in touch until you are home.",
      c: ["bookflow", "price", "payment"], wa: "I would like to plan a trip." },
    { id: "price", t: "Prices and quotes", k: ["price", "prices", "how much", "cheap", "cheapest", "expensive", "afford", "budget", "money", "pay for", "usd", "dollars", "shillings", "ksh", "kes", "discount", "offer price", "package price"],
      a: "Prices depend on the route, the season, the vehicles and the lodges, so we quote for each request. Every quotation lists what is included, what costs extra and the terms that apply. Send your dates, group size and the parks you have in mind and the team replies with a quotation.",
      c: ["booking", "parkfees", "payment"], wa: "Please send me a quotation. My dates, group size and places are:" },
    { id: "payment", t: "Payment and cancellation", k: ["payment", "pay", "paying", "deposit", "cancel", "cancellation", "refund", "mpesa", "m-pesa", "card", "bank", "transfer money", "terms"],
      a: "Deposit, payment and cancellation terms are set out in your quotation and on our " + L("terms.html", "Terms and Conditions") + " page. For the details that apply to your trip, please ask the team.",
      c: ["booking", "price", "contact"], wa: "I have a question about payment and cancellation." },
    { id: "contact", t: "Contact details", k: ["contact", "phone", "call", "number", "email", "mail", "reach", "whatsapp", "message", "instagram", "tiktok", "social"],
      a: "WhatsApp or phone: " + '<a href="tel:' + PHRAW + '">' + PH + "</a>. Email: " + '<a href="mailto:' + EM + '">' + EM + "</a>. We are on Instagram and TikTok too, linked in the footer.",
      c: ["location", "hours", "booking"], wa: "Hello Biophilic Universal, I would like to plan a trip." },
    { id: "location", t: "Where are you?", k: ["where are you", "location", "located", "office", "address", "nairobi", "based", "visit you", "find you"],
      a: "Our office is in Nairobi, Kenya. For a street address or to arrange a meeting, please message the team.",
      c: ["contact", "hours", "about"], wa: "Could you share your office address?" },
    { id: "hours", t: "Opening hours", k: ["hours", "opening", "open", "closed", "available now", "reply", "response", "how fast", "online"],
      a: "I do not have our opening hours. Message us on WhatsApp and the team replies as soon as they can.",
      c: ["contact", "booking", "price"], wa: "Hello, are you available to talk about a trip?" },
    { id: "flights", t: "Flights", k: ["flight", "flights", "air ticket", "air tickets", "ticket", "tickets", "airline", "fly", "plane", "visa", "passport", "international"],
      a: "We focus on trips inside Kenya: safaris, experiences, transfers, car hire and stays. For flights, please ask the team on WhatsApp.",
      c: ["transfers", "services", "contact"], wa: "I have a question about flights." },
    { id: "children", t: "Children and families", k: ["child", "children", "kids", "kid", "family", "families", "baby", "toddler", "infant", "elderly", "senior", "disability", "wheelchair", "mobility", "dietary", "allergy", "vegetarian", "vegan", "halal"],
      a: "Tell us the ages of your group, and any dietary or access needs, when you ask. We plan around them, and we check with the lodge or experience before you confirm. Some experiences have age or fitness limits.",
      c: ["stays", "experiences", "contact"], wa: "I am travelling with children or have special needs and would like to ask about:" },
    { id: "group", t: "Groups and private trips", k: ["group", "groups", "private", "alone", "solo", "couple", "honeymoon", "share", "sharing", "strangers", "big group", "corporate", "team"],
      a: "We plan one vehicle per group, so the pace and the stops are yours. We do not put you in a vehicle with strangers. Tell us the size of your group and we match the vehicle and rooms.",
      c: ["carhire", "price", "contact"], wa: "I would like to plan a trip for a group." },
    { id: "impact", t: "Our approach", k: ["impact", "sustainable", "sustainability", "eco", "environment", "responsible", "guide", "guides", "community", "conservation", "green", "waste", "water"],
      a: "We suggest fewer parks per trip, so days have long drives and no rushed transfers. We ask lodges and drivers for guides who know the park you are visiting. On request we ask each lodge about water, waste and local hiring, and pass on what they tell us.",
      c: ["about", "safaris", "contact"] },
    { id: "trust", t: "Are you registered?", k: ["registered", "licence number", "licensed", "licenced", "legit", "legitimate", "trust", "trusted", "genuine", "real company", "scam", "credentials", "reviews", "testimonials", "references"],
      a: "Our company details are on the " + L("about.html", "About us") + " page. If you would like to see a document before you book, please message the team.",
      c: ["about", "contact", "payment"], wa: "Could you share your company registration details?" },
    { id: "privacy", t: "Privacy", k: ["privacy", "data", "personal data", "cookies", "gdpr", "information you collect"],
      a: "Our " + L("privacy.html", "Privacy Policy") + " explains what we collect and why. There is no enquiry form on this site: you contact us by WhatsApp, email or phone.",
      c: ["terms", "contact", "about"] },
    { id: "thanks", t: "Thank you", k: ["thanks", "thank you", "asante", "cheers", "great", "perfect", "awesome", "ok thanks", "appreciate"],
      a: "You are welcome. If you would like a quotation, send your dates and the places you have in mind on WhatsApp.",
      c: ["booking", "contact"], wa: "Hello Biophilic Universal, I would like to plan a trip." },
    { id: "bye", t: "Goodbye", k: ["bye", "goodbye", "see you", "later", "that is all", "no more"],
      a: "Goodbye, and karibu Kenya. We are here when you are ready.", c: [] },
    { id: "human", t: "Talk to a person", k: ["human", "person", "agent", "real person", "talk to a person", "talk to someone", "speak to someone", "speak to a person", "talk to a human", "somebody", "someone", "representative", "staff", "operator", "not a bot", "customer care", "customer service"],
      a: "Of course. I am an automated helper, and the team can take it from here. Tap the button to message them on WhatsApp.",
      c: ["contact"], wa: "Hello Biophilic Universal, I would like to speak to someone." }
  ];
  var BY = {}; KB.forEach(function (e) { BY[e.id] = e; });

  /* ---------- matching: lower-case, light stemming, small typo tolerance ---------- */
  var STOP = "a an the is are was were am be to of for in on at by with and or do does did can could would should i me my we our you your it its this that these those please tell about want like need know any some there here what which who whom how also just really very so if then as from up out into over".split(" ");
  var SYN = { tym: "time", tyme: "time", wen: "when", wat: "what", dayz: "day", wich: "which", ur: "your", cost: "price", costs: "price", pricing: "price", rate: "price", rates: "price", charge: "price", charges: "price", rent: "hire", renting: "hire", rental: "hire", rentals: "hire", hotel: "hotel", hotels: "hotel" };
  function stem(w) {
    if (SYN[w]) return SYN[w];
    if (w.length > 5 && /ies$/.test(w)) return w.slice(0, -3) + "y";
    if (w.length > 5 && /ing$/.test(w)) return w.slice(0, -3);
    if (w.length > 4 && /es$/.test(w)) return w.slice(0, -2);
    if (w.length > 3 && /s$/.test(w) && !/ss$/.test(w)) return w.slice(0, -1);
    return w;
  }
  function toks(s, keepStop) {
    return s.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim().split(" ").filter(function (w) { return w && (keepStop || STOP.indexOf(w) < 0); }).map(stem);
  }
  function lev(a, b, max) {
    if (Math.abs(a.length - b.length) > max) return max + 1;
    var p = [], i, j; for (j = 0; j <= b.length; j++) p[j] = j;
    for (i = 1; i <= a.length; i++) {
      var c = [i], m = i;
      for (j = 1; j <= b.length; j++) { c[j] = Math.min(p[j] + 1, c[j - 1] + 1, p[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)); if (c[j] < m) m = c[j]; }
      if (m > max) return max + 1; p = c;
    }
    return p[b.length];
  }
  var INDEX = KB.map(function (e) { var seen = {}, ks = []; e.k.forEach(function (x) { var tk = toks(x, true), key = tk.join(" "); if (key && !seen[key]) { seen[key] = 1; ks.push(tk); } }); return { e: e, k: ks }; });
  function score(q) {
    var qt = toks(q), full = " " + toks(q, true).join(" ") + " ", out = [];
    INDEX.forEach(function (it) {
      var s = 0;
      it.k.forEach(function (kt) {
        if (!kt.length) return;
        if (kt.length > 1) { if (full.indexOf(" " + kt.join(" ") + " ") > -1) s += 3 + kt.length * 0.5; return; }
        var w = kt[0];
        if (qt.indexOf(w) > -1) s += 2;
        else if (w.length >= 4) { var mx = w.length >= 8 ? 2 : 1; for (var i = 0; i < qt.length; i++) { if (qt[i].length >= 4 && qt[i].charAt(0) === w.charAt(0) && lev(qt[i], w, mx) <= mx) { s += 1.6; break; } } }
      });
      if (s > 0) out.push({ e: it.e, s: s });
    });
    return out.sort(function (a, b) { return b.s - a.s; });
  }

  /* ---------- the chat window ---------- */
  var fab = document.createElement("button");
  fab.id = "botFab"; fab.type = "button"; fab.className = "bot-fab"; fab.setAttribute("aria-haspopup", "dialog"); fab.setAttribute("aria-expanded", "false"); fab.setAttribute("aria-controls", "botPanel");
  fab.setAttribute("aria-label", "Ask us anything"); fab.title = "Ask us anything";
  fab.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4.500 5.500h15a1.500 1.500 0 0 1 1.500 1.500v8.500a1.500 1.500 0 0 1-1.500 1.500H10l-4 3.500V17H4.500A1.500 1.500 0 0 1 3 15.500V7a1.500 1.500 0 0 1 1.500-1.500Z"/><path d="M8 10h8M8 13h5"/></svg><span>Ask us anything</span>';
  var panel = document.createElement("section");
  panel.id = "botPanel"; panel.className = "bot-panel"; panel.hidden = true; panel.setAttribute("role", "dialog"); panel.setAttribute("aria-label", "Ask Biophilic Universal");
  panel.innerHTML =
    '<header class="bot-head"><div><strong>Ask Biophilic Universal</strong><small>Automated helper. Answers come from this website.</small></div>' +
    '<button type="button" class="bot-x" aria-label="Close chat"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg></button></header>' +
    '<div class="bot-log" role="log" aria-live="polite" aria-relevant="additions"></div>' +
    '<form class="bot-form" autocomplete="off"><label class="bot-sr" for="botIn">Type your question</label>' +
    '<input id="botIn" type="text" maxlength="200" placeholder="Type your question" enterkeyhint="send">' +
    '<button type="submit" class="bot-send" aria-label="Send"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h15M13 6l6 6-6 6"/></svg></button></form>' +
    '<p class="bot-note">I cannot see availability or prices. For those, the team replies on WhatsApp.</p>';
  document.body.appendChild(fab); document.body.appendChild(panel);
  var log = panel.querySelector(".bot-log"), input = panel.querySelector("#botIn"), form = panel.querySelector(".bot-form");
  var started = false, last = null, busy = false;

  function waUrl(msg) { return "https://wa.me/" + NUM + "?text=" + encodeURIComponent("Hello Biophilic Universal, " + msg.replace(/^Hello Biophilic Universal,?\s*/i, "")); }
  function scroll() { log.scrollTop = log.scrollHeight; }
  function userMsg(t) { var d = document.createElement("div"); d.className = "bot-msg me"; d.textContent = t; log.appendChild(d); scroll(); }
  function chips(ids, extra) {
    var w = document.createElement("div"); w.className = "bot-chips";
    ids.forEach(function (id) { var e = BY[id]; if (!e) return; var b = document.createElement("button"); b.type = "button"; b.textContent = e.t; b.addEventListener("click", function () { ask(e.t, id); }); w.appendChild(b); });
    if (extra) w.appendChild(extra);
    return w;
  }
  function waBtn(msg, label) { var a = document.createElement("a"); a.className = "bot-wa"; a.href = waUrl(msg); a.target = "_blank"; a.rel = "noopener"; a.textContent = label || "Message the team on WhatsApp"; return a; }
  function botMsg(html, e, extraNode, noChips) {
    var d = document.createElement("div"); d.className = "bot-msg bot"; var p = document.createElement("div"); p.innerHTML = html; d.appendChild(p);
    if (e && e.wa) d.appendChild(waBtn(e.wa));
    if (extraNode) d.appendChild(extraNode);
    if (e && !noChips && e.c && e.c.length) d.appendChild(chips(e.c));
    log.appendChild(d); scroll();
  }
  function typing(cb) {
    if (reduce) { cb(); return; }
    busy = true; var d = document.createElement("div"); d.className = "bot-msg bot bot-typing"; d.setAttribute("aria-hidden", "true"); d.innerHTML = "<i></i><i></i><i></i>"; log.appendChild(d); scroll();
    setTimeout(function () { d.remove(); busy = false; cb(); }, 480);
  }
  function answer(e) { if (e.flow) { startFlow(); return; } last = e.id; botMsg(e.a, e); }
  function ask(text, id) {
    if (busy) return;
    if (flow && !id) { flowInput(text); return; }
    if (flow && id) { endFlow(true); }
    userMsg(text);
    if (id) { typing(function () { answer(BY[id]); }); return; }
    var r = score(text);
    typing(function () {
      var top = r[0], second = r[1];
      if (!top || top.s < 1.5) {
        var f = document.createElement("div"); f.appendChild(waBtn("I have a question: " + text, "Ask the team on WhatsApp"));
        botMsg("I am not sure I have that on the website. The team can answer it directly, and I will pass your question along.", null, f.firstChild);
        log.lastChild.appendChild(chips(["services", "price", "contact"])); scroll(); return;
      }
      if (second && second.s >= top.s * 0.85 && second.e.id !== top.e.id && top.s < 6) {
        botMsg("I want to be sure I understood. Did you mean one of these?", null, chips([top.e.id, second.e.id].concat(r[2] && r[2].s >= top.s * 0.7 ? [r[2].e.id] : [])), true);
        return;
      }
      answer(top.e);
    });
  }

  /* ---------- guided booking: asks one thing at a time, then opens WhatsApp with everything written out ---------- */
  var flow = null;
  var SERVICES = ["Safari", "Stay or BnB", "Car hire", "Transfer", "Experience", "Not sure yet"];
  var PLACES = ["Masai Mara", "Amboseli", "Tsavo East", "Samburu", "Lake Nakuru", "Lake Naivasha", "Mount Kenya", "Diani Beach", "Nairobi", "Not sure yet"];
  function esc(t) { return String(t).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function iso(d) { var m = d.getMonth() + 1, dd = d.getDate(); return d.getFullYear() + "-" + (m < 10 ? "0" : "") + m + "-" + (dd < 10 ? "0" : "") + dd; }
  function fmt(v) { return /^\d{4}-\d{2}-\d{2}$/.test(v) ? new Date(v + "T00:00:00").toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric" }) : v; }
  function setInput(type, ph, max) {
    input.type = type; input.placeholder = ph; input.maxLength = max || 200;
    if (type === "date") { input.min = iso(new Date()); } else { input.removeAttribute("min"); }
    input.setAttribute("inputmode", type === "numeric" ? "numeric" : "text");
    if (type === "numeric") input.type = "text";
  }
  function flowChips(list, withCancel) {
    var w = document.createElement("div"); w.className = "bot-chips";
    list.forEach(function (t) { var b = document.createElement("button"); b.type = "button"; b.textContent = t; b.addEventListener("click", function () { flowInput(t); }); w.appendChild(b); });
    if (withCancel !== false) { var c = document.createElement("button"); c.type = "button"; c.textContent = "Cancel"; c.addEventListener("click", function () { flowInput("cancel"); }); w.appendChild(c); }
    return w;
  }
  function endFlow(silent) {
    flow = null; setInput("text", "Type your question");
    if (!silent) { botMsg("No problem, I have cleared that. You can ask me anything, or start again whenever you like.", { c: ["bookflow", "services", "contact"] }); }
  }
  function startFlow() {
    flow = { step: "service", d: {} };
    botMsg("Good, I will take your details one at a time. When we finish, WhatsApp opens with your message already written, and you only press send. This is a booking request, not a confirmed booking: the team checks availability and replies with a price. Type <b>cancel</b> at any time.<br><br>What would you like to book?", null, flowChips(SERVICES), true);
    setInput("text", "Or type here");
  }
  function ask1(step) {
    var d = flow.d, sv = d.service || ""; flow.step = step;
    if (step === "where") {
      var q = /transfer/i.test(sv) ? "Where from and where to? For example: JKIA airport to a hotel in Diani." : /car/i.test(sv) ? "Where will you use the vehicle, and where do you pick it up?" : /stay/i.test(sv) ? "Which area or destination should the stay be in?" : "Which park or place do you have in mind? Pick one or type your own.";
      botMsg(q, null, flowChips(PLACES), true); setInput("text", "Type a place");
    } else if (step === "start") {
      var lab = /stay/i.test(sv) ? "check-in date" : /transfer/i.test(sv) ? "pick-up date" : "start date";
      botMsg("What is your " + lab + "? Choose it below, then press send.", null, flowChips(["Not sure of the dates yet"]), true); setInput("date", "Pick a date");
    } else if (step === "end") {
      var lab2 = /stay/i.test(sv) ? "check-out date" : "last day";
      botMsg("And your " + lab2 + "?", null, flowChips(["One day only", "Not sure yet"]), true); setInput("date", "Pick a date");
      if (d.startIso) input.min = d.startIso;
    } else if (step === "guests") {
      botMsg("How many people are travelling? Count children too.", null, flowChips(["1", "2", "3", "4", "5", "6", "7 or more"]), true); setInput("text", "Number of people", 3); input.setAttribute("inputmode", "numeric");
    } else if (step === "name") {
      botMsg("What is your name?", null, flowChips([], true), true); setInput("text", "Your name", 60);
    } else if (step === "notes") {
      botMsg("Anything else the team should know? For example your budget, ages of children, flight number or special needs.", null, flowChips(["Nothing else"]), true); setInput("text", "Optional notes", 300);
    } else if (step === "confirm") { summary(); }
    var f = input.type === "date" ? 0 : 1; if (f) setTimeout(function () { input.focus(); }, 80);
  }
  function lines() {
    var d = flow.d, sv = d.service || "", out = [["Service", d.service], ["Where", d.where]];
    var a = /stay/i.test(sv) ? "Check-in" : /transfer/i.test(sv) ? "Pick-up date" : "Start date", b = /stay/i.test(sv) ? "Check-out" : "Last day";
    out.push([a, d.start]); if (!/transfer/i.test(sv)) out.push([b, d.end]);
    out.push(["Guests", d.guests], ["Name", d.name]); if (d.notes) out.push(["Notes", d.notes]);
    return out;
  }
  function summary() {
    var ls = lines(), html = "Here is your request. Please check it:<br><br>", msg = "I would like to make a booking request.";
    ls.forEach(function (l) { html += "<b>" + esc(l[0]) + ":</b> " + esc(l[1]) + "<br>"; msg += "\n" + l[0] + ": " + l[1]; });
    html += "<br>Press the button. WhatsApp opens with this message ready, and you press send there. The team replies with availability and a price.";
    var w = document.createElement("div"); w.appendChild(waBtn(msg, "Send to the team on WhatsApp"));
    var c = flowChips(["Start again"], true); w.appendChild(c);
    botMsg(html, null, w, true);
    flow.step = "done"; setInput("text", "Type your question");
  }
  function flowInput(val) {
    if (busy || !flow) return;
    val = String(val).trim(); if (!val) return;
    var shown = flow.step === "start" || flow.step === "end" ? fmt(val) : val; userMsg(shown);
    if (/^(cancel|stop|quit|exit|no thanks)$/i.test(val)) { typing(function () { endFlow(); }); return; }
    if (/^start again$/i.test(val)) { typing(function () { startFlow(); }); return; }
    var d = flow.d, st = flow.step, today = iso(new Date());
    function bad(msg) { typing(function () { botMsg(msg); if (st === "start" || st === "end") { setInput("date", "Pick a date"); if (st === "end" && d.startIso) input.min = d.startIso; } }); }
    function go(n) { typing(function () { ask1(n); }); }
    if (st === "service") { d.service = val.slice(0, 60); go("where"); }
    else if (st === "where") { d.where = val.slice(0, 80); go("start"); }
    else if (st === "start") {
      if (/^not sure/i.test(val)) { d.start = "Not sure yet"; d.startIso = ""; go(/transfer/i.test(d.service) ? "guests" : "end"); return; }
      var t = /^\d{4}-\d{2}-\d{2}$/.test(val) ? val : (isNaN(Date.parse(val)) ? "" : iso(new Date(Date.parse(val))));
      if (!t) { bad("I could not read that date. Please pick it from the calendar."); return; }
      if (t < today) { bad("That date has already passed. Please pick today or a later date."); return; }
      d.start = fmt(t); d.startIso = t; go(/transfer/i.test(d.service) ? "guests" : "end");
    } else if (st === "end") {
      if (/^one day/i.test(val)) { d.end = "One day only"; go("guests"); return; }
      if (/^not sure/i.test(val)) { d.end = "Not sure yet"; go("guests"); return; }
      var e = /^\d{4}-\d{2}-\d{2}$/.test(val) ? val : (isNaN(Date.parse(val)) ? "" : iso(new Date(Date.parse(val))));
      if (!e) { bad("I could not read that date. Please pick it from the calendar."); return; }
      if (e < today || (d.startIso && e < d.startIso)) { bad("That date is before your start date. Please pick a later date."); return; }
      d.end = fmt(e); go("guests");
    } else if (st === "guests") {
      if (/^7 or more$/i.test(val)) { d.guests = "7 or more"; go("name"); return; }
      var n = parseInt(val, 10);
      if (!/^\d{1,3}$/.test(val) || n < 1) { bad("Please type a number of people, for example 4."); return; }
      d.guests = String(n); go("name");
    } else if (st === "name") {
      if (val.length < 2) { bad("Please type your name."); return; }
      d.name = val.slice(0, 60); go("notes");
    } else if (st === "notes") {
      d.notes = /^nothing else$/i.test(val) ? "" : val.slice(0, 300); go("confirm");
    } else { typing(function () { botMsg("Your request is ready above. Press the green button to send it, or choose Start again."); }); }
  }
  function open() {
    panel.hidden = false; document.body.classList.add("bot-open"); fab.setAttribute("aria-expanded", "true");
    requestAnimationFrame(function () { panel.classList.add("on"); });
    if (!started) { started = true; botMsg(BY.hello.a, BY.hello); }
    setTimeout(function () { input.focus(); }, reduce ? 0 : 60);
  }
  function close() {
    panel.classList.remove("on"); fab.setAttribute("aria-expanded", "false");
    setTimeout(function () { panel.hidden = true; document.body.classList.remove("bot-open"); }, reduce ? 0 : 290);
    fab.focus();
  }
  fab.addEventListener("click", function () { open(); });
  panel.querySelector(".bot-x").addEventListener("click", close);
  panel.addEventListener("keydown", function (ev) { if (ev.key === "Escape") { ev.stopPropagation(); close(); } });
  form.addEventListener("submit", function (ev) { ev.preventDefault(); var v = input.value.trim(); if (!v) return; input.value = ""; ask(v); });
  setTimeout(function () { fab.classList.add("on"); }, 1700);
})();
