document.getElementById('proposalForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  // Gather form data
  const businessName = document.getElementById('businessName').value;
  const clientContactEmail = document.getElementById('clientContactEmail').value;
  const clientContactPerson = document.getElementById('clientContactPerson').value || businessName; // Default to business name if empty
  const accountExecName = document.getElementById('accountExecName').value;
  const accountExecEmail = document.getElementById('accountExecEmail').value;
  const accountExecTitle = document.getElementById('accountExecTitle').value;
  const notes = document.getElementById('notes').value; // Still have this, though not in new template explicitly

  const selectedServiceNodes = document.querySelectorAll('input[name="service"]:checked');
  let servicesList = Array.from(selectedServiceNodes).map(node => `<li>${node.value}</li>`).join('');
  if (!servicesList) {
    servicesList = "<li>None selected</li>";
  }

  // Dates
  const currentDate = new Date();
  const expiryDate = new Date();
  expiryDate.setDate(currentDate.getDate() + 30);
  const formattedCurrentDate = currentDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  const formattedExpiryDate = expiryDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  // Logo fetching logic (remains the same)
  const domainGuess = businessName.toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9.\-]/g, '') + ".com";
  const logoUrl = `https://logo.clearbit.com/${domainGuess}`;
  const clientLogo = document.getElementById('clientLogo');
  clientLogo.style.display = 'inline-block';
  const faviconFallbackUrl = `https://www.google.com/s2/favicons?domain=${domainGuess}&sz=64`;
  clientLogo.onerror = () => {
    clientLogo.onerror = () => {
      clientLogo.style.display = "none";
    };
    clientLogo.src = faviconFallbackUrl;
  };
  clientLogo.src = logoUrl;

  // --- Proposal HTML Template ---
  const proposalHTML = `
    <style>
        /* Styles specific to proposal output, ensuring Tailwind is effective */
        body { /* This body is within the context of where this HTML is injected */
            font-family: 'Inter', sans-serif;
            background-color: #f8fafc; /* Tailwind's gray-50 */
            color: #334155; /* Tailwind's slate-700 */
            line-height: 1.6;
        }
        .proposal-container { /* Renamed from .container to avoid conflict if any global .container style exists */
            max-width: 800px;
            margin: 0 auto;
            /* padding: 2rem; Tailwind p-8 can be used on sections */
        }
        .page-break {
            page-break-before: always;
            padding-top: 2rem; /* Give some space after page break */
        }
        .ziply-green-text { color: #4CAF50; }
        .ziply-blue-text { color: #00BCD4; }

        /* Network Diagram Styles (from example) */
        .network-diagram-container {
            background-color: #228B22; /* Darker green background for the diagram */
            padding: 2rem;
            border-radius: 0.5rem;
            margin-top: 2rem;
            color: white; /* White text for diagram elements */
            position: relative; /* Needed for absolute positioning of lines/nodes */
            overflow: hidden; /* To contain absolute elements if they poke out */
        }
        .network-node {
            background-color: #3B82F6; /* Blue for servers/nodes */
            border-radius: 0.25rem;
            padding: 0.5rem;
            text-align: center;
            font-size: 0.75rem;
            line-height: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 40px; /* min-height instead of fixed height */
            min-width: 80px;  /* min-width instead of fixed width */
        }
        .network-cloud {
            background-color: #6B7280; /* Gray for clouds */
            border-radius: 9999px; /* Full circle */
            width: 80px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 0.75rem;
        }
        /* Simplified lines - these are hard to make truly dynamic without JS/SVG for connections */
        .network-line { height: 2px; background-color: #A7F3D0; position: absolute; }
        .network-label { font-size: 0.65rem; text-align: center; margin-top: 0.25rem; color: #D1FAE5; }
        /* Ensure Tailwind base does not override these if they are too generic */
    </style>

    <!-- Page 1: Cover Page -->
    <div class="proposal-container min-h-screen flex flex-col justify-between items-center text-center py-12 px-4 sm:px-8">
        <div></div> <!-- Spacer -->
        <div>
            <div class="flex items-center justify-center mb-8">
                <img src="ziply-logo.png" alt="Ziply Logo" style="height: 60px; margin-right: 10px;" />
                <!-- Client logo will be shown in the main header, not repeated here unless desired -->
            </div>
            <h1 class="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-4">Ziply Fiber Business Proposal</h1>
            <p class="text-xl text-gray-700">${businessName}</p>
            <p class="text-lg text-gray-500 mt-6">${formattedCurrentDate}</p>
        </div>
        <div class="text-sm text-gray-400">
            <p>enterprise.ziplyfiber.com</p>
            <p class="text-lg font-bold ziply-green-text">ziply fiber</p>
        </div>
    </div>

    <!-- Page 2: Introduction Letter -->
    <div class="page-break proposal-container py-12 px-4 sm:px-8">
        <p class="text-sm text-gray-500 mb-8">${formattedCurrentDate}</p>

        <p class="font-semibold text-gray-800 mb-1">${clientContactPerson}</p>
        <p class="font-semibold text-gray-800 mb-1">${businessName}</p>
        ${clientContactEmail ? `<p class="text-gray-600 mb-4">${clientContactEmail}</p>` : ''}

        <p class="font-semibold text-gray-800 mb-4">Re: Ziply Fiber Business Proposal</p>
        <p class="mb-4">Dear ${clientContactPerson},</p>
        <p class="mb-4">
            Ziply Fiber is pleased to offer the attached proposal to ${businessName}. As a
            local company, we are committed to working closely with businesses around the Northwest
            region to deliver state-of-the-art telecommunications and fiber-optic internet solutions. This
            proposal outlines the recommended services designed specifically for your business needs.
        </p>

        <h3 class="text-xl font-semibold text-gray-800 mt-6 mb-2">Services Proposed:</h3>
        <ul class="list-disc list-inside mb-4 pl-4">
            ${servicesList}
        </ul>

        ${notes ? `<h3 class="text-xl font-semibold text-gray-800 mt-6 mb-2">Additional Notes:</h3><p class="mb-4 whitespace-pre-wrap">${notes}</p>` : ''}

        <p class="mb-4">
            Thank you for considering Ziply Fiber. We appreciate the opportunity to present this
            information and look forward to working with you.
        </p>
        <p class="font-semibold text-gray-800 mb-8">This pricing quotation and service information is valid until: ${formattedExpiryDate}.</p>
        <p class="mb-2">Regards,</p>
        <p class="font-semibold text-gray-800">${accountExecName}</p>
        <p class="text-gray-600">${accountExecTitle}</p>
        <p class="text-gray-600">${accountExecEmail}</p>

        <div class="mt-12 text-sm text-gray-400 text-right">
            <p>enterprise.ziplyfiber.com</p>
            <p class="text-lg font-bold ziply-green-text">ziply fiber</p>
        </div>
    </div>

    <!-- Page 3: Company Information & Network Reliability -->
    <div class="page-break proposal-container py-12 px-4 sm:px-8">
        <h2 class="text-3xl font-bold text-gray-900 mb-4">Ziply Fiber Company Information</h2>
        <h3 class="text-2xl font-semibold text-gray-800 mt-6 mb-2">Who is Ziply Fiber?</h3>
        <p class="mb-4 text-gray-700">
            Headquartered in Kirkland, Washington, with major offices in Everett, Washington; Beaverton, Oregon;
            and Hayden, Idaho, Ziply Fiber is a local company focused on connecting Northwest communities, with
            attention to rural and historically underserved areas. Since acquiring the Northwest segment of Frontier
            Communications in 2020, we've invested hundreds of millions of dollars in infrastructure to create a fully
            redundant backbone. Our executive team consists of former executives from AT&T, Lumen and Astound
            Broadband who either grew up in the Northwest or have spent decades living and working here.
        </p>
        <h3 class="text-2xl font-semibold text-gray-800 mt-6 mb-2">Ziply Fiber is the most reliable network in the Northwest</h3>
        <ul class="list-disc list-inside space-y-2 mb-4 text-gray-700">
            <li><span class="font-semibold">Purpose-built for performance:</span> We operate our core network so that it won't exceed 40% of capacity at peak hours. With over 20+ Tbit/sec on all inter-city fiber routes, sub 3ms end-to-end latency and 3 Tbit/sec+ of edge-facing capacity, Ziply Fiber's network is built to meet your network performance needs.</li>
            <li><span class="font-semibold">A better network doesn't go down:</span> Ziply Fiber has engineered its core network to be fully redundant with a dual infrastructure that will maintain customer connections even when an issue arises on the network.</li>
            <li><span class="font-semibold">Building a network for the future:</span> Your network is only as good as the investment your provider puts into it, and at Ziply Fiber, we have invested hundreds of millions of dollars of working capital in the communities we serve for the best connectivity experience now and in the future.</li>
            <li><span class="font-semibold">A four-state regionally focused network:</span> We are local and focused on connecting the communities we work and live in. With deep knowledge of the Northwest's unique topographical and meteorological challenges, we are prepared to handle the elements to keep you online, all the time.</li>
        </ul>
        <div class="mt-12 text-sm text-gray-400 text-right">
            <p>enterprise.ziplyfiber.com</p>
            <p class="text-lg font-bold ziply-green-text">ziply fiber</p>
        </div>
    </div>

    <!-- Page 4: Network Diagram & Infrastructure Details -->
    <div class="page-break proposal-container py-12 px-4 sm:px-8">
        <h2 class="text-3xl font-bold text-gray-900 mb-4">Ziply Fiber's network</h2>
        <p class="mb-4 text-gray-700">
            Ziply Fiber's optical network consists of over 20,000 route-miles, and it's growing rapidly. We've designed
            the core and aggregation networks to be fully redundant, so when an unplanned outage does arise, it
            poses zero disruption to our customers. We own and maintain over 200 Central Offices (CO) throughout
            our operating area, servicing over 210 regional cities and towns. Utilizing our own fiber-optic network
            eliminates the need for using other third-party carriers for our service. We can deliver reliable bandwidth,
            because we have the ability to upgrade to 100G at any time. Depending on the service upgrade, an
            equipment exchange may be needed.
        </p>

        <div class="network-diagram-container h-[400px] flex items-center justify-center">
            <!-- This is a simplified representation. True dynamic lines are complex. -->
            <div class="absolute top-8 left-12 network-cloud">OPEN INTERNET</div>
            <div class="absolute top-8 right-12 network-cloud">OPEN INTERNET</div>

            <div class="absolute top-24 left-24 network-node">EDGE (Google)</div>
            <div class="absolute top-24 right-24 network-node">EDGE (AWS)</div>

            <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                <div class="text-xl font-bold">ZIPLY FIBER</div>
                <div class="text-xl font-bold">CORE NETWORK</div>
            </div>

            <div class="absolute top-1/4 left-1/4 network-node w-20 h-10">CORE</div>
            <div class="absolute top-1/4 right-1/4 network-node w-20 h-10">CORE</div>
            <div class="absolute bottom-1/4 left-1/4 network-node w-20 h-10">CORE</div>
            <div class="absolute bottom-1/4 right-1/4 network-node w-20 h-10">CORE</div>

            <div class="absolute bottom-8 left-12 flex flex-col items-center">
                <div class="network-node w-24">AGGREGATION</div>
                <div class="network-label mt-1">AGGREGATION NET</div>
            </div>
            <div class="absolute bottom-8 right-12 flex flex-col items-center">
                 <div class="network-node w-24">DISTRIBUTION</div>
                <div class="network-label mt-1">DISTRIBUTION NET</div>
            </div>

            <!-- Conceptual lines - needs JS for real connections or more complex CSS -->
        </div>

        <h3 class="text-2xl font-semibold text-gray-800 mt-8 mb-2">Infrastructure upgrades</h3>
        <p class="mb-2 text-gray-700">We are continually upgrading our core infrastructure to significantly increase network performance and reliability. This includes:</p>
        <ul class="list-disc list-inside space-y-1 mb-4 text-gray-700">
            <li>Replacing legacy copper wiring with high-capacity fiber.</li>
            <li>Extending the core network closer to premise.</li>
            <li>Standardizing CO design across the region.</li>
            <li>Incorporating dense wavelength division multiplexing (DWDM) technology.</li>
        </ul>
        <h3 class="text-2xl font-semibold text-gray-800 mt-6 mb-2">Automated configuration</h3>
        <p class="mb-4 text-gray-700">We use automated configuration management to minimize human error and increase reliability. Remote monitoring and automation mean fewer technicians in and out of the facility and the ability to identify issues before they become disruptive.</p>
        <h3 class="text-2xl font-semibold text-gray-800 mt-6 mb-2">Redundant core</h3>
        <p class="mb-4 text-gray-700">Another way we reinforce reliability and performance is with a core DWDM backbone capable of 20+Tbps on all fiber routes. Unlike other carriers who rely on us for last-mile connections, we own our network. That means we maintain our own independent systems between markets, so we control the maintenance schedule and can isolate and fix any issues that arise.</p>
        <div class="mt-12 text-sm text-gray-400 text-right">
            <p>enterprise.ziplyfiber.com</p>
            <p class="text-lg font-bold ziply-green-text">ziply fiber</p>
        </div>
    </div>
  `;

  // Output the proposal
  const outputDiv = document.getElementById('proposalOutput');
  outputDiv.classList.remove('hidden');
  outputDiv.innerHTML = proposalHTML;
});
