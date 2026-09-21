## desktopTrace

The performance trace has been stopped.
Emulating viewport: {"deviceScaleFactor":1,"isMobile":false,"hasTouch":false,"isLandscape":false,"width":1440,"height":900}
Emulating color scheme: light
## Summary of Performance trace findings:
URL: http://localhost:4391/en/profile/2026/
Trace bounds: {min: 11789316388µs, max: 11794384263µs}
CPU throttling: 1x
Network throttling: none

# Available insight sets

The following is a list of insight sets. An insight set covers a specific part of the trace, split by navigations. The insights within each insight set are specific to that part of the trace. Be sure to consider the insight set id and bounds when calling functions. If no specific insight set or navigation is mentioned, assume the user is referring to the first one.

## insight set id: NAVIGATION_0

URL: http://localhost:4391/en/profile/2026/
Bounds: {min: 11789317720µs, max: 11794384263µs}
Metrics (lab / observed):
  - LCP: 100 ms, event: (eventKey: r-7150, ts: 11789417585), nodeId: 63
  - LCP breakdown:
    - TTFB: 1 ms, bounds: {min: 11789317720µs, max: 11789318958.999998µs}
    - Load delay: 4 ms, bounds: {min: 11789318958.999998µs, max: 11789323200µs}
    - Load duration: 2 ms, bounds: {min: 11789323200µs, max: 11789325377µs}
    - Render delay: 92 ms, bounds: {min: 11789325377µs, max: 11789417585µs}
  - INP: 9 ms, event: (eventKey: s-18015, ts: 11793345628)
  - CLS: 0.00
Metrics (field / real users): n/a – no data for this page in CrUX
Available insights:
  - insight name: INPBreakdown
    description: Start investigating [how to improve INP](https://developer.chrome.com/docs/performance/insights/inp-breakdown) by looking at the longest subpart.
    relevant trace bounds: {min: 11793345628µs, max: 11793354329µs}
    example question: Suggest fixes for my longest interaction
    example question: Why is a large INP score problematic?
    example question: What's the biggest contributor to my longest interaction?
  - insight name: LCPBreakdown
    description: Each [subpart has specific improvement strategies](https://developer.chrome.com/docs/performance/insights/lcp-breakdown). Ideally, most of the LCP time should be spent on loading the resources, not within delays.
    relevant trace bounds: {min: 11789317720µs, max: 11789417585µs}
    example question: Help me optimize my LCP score
    example question: Which LCP subpart was most problematic?
    example question: What can I do to reduce the LCP time for this page load?
  - insight name: LCPDiscovery
    description: [Optimize LCP](https://developer.chrome.com/docs/performance/insights/lcp-discovery) by making the LCP image discoverable from the HTML immediately, and avoiding lazy-loading.
    relevant trace bounds: {min: 11789318958.999998µs, max: 11789326408µs}
    example question: Suggest fixes to reduce my LCP
    example question: What can I do to reduce my LCP discovery time?
    example question: Why is LCP discovery time important?
  - insight name: RenderBlocking
    description: Requests are blocking the page’s initial render, which may delay LCP. [Deferring or inlining](https://developer.chrome.com/docs/performance/insights/render-blocking) can move these network requests out of the critical path.
    relevant trace bounds: {min: 11789323306µs, max: 11789326565µs}
    estimated metric savings: FCP 0 ms, LCP 0 ms
    example question: Show me the most impactful render-blocking requests that I should focus on
    example question: How can I reduce the number of render-blocking requests?
  - insight name: NetworkDependencyTree
    description: [Avoid chaining critical requests](https://developer.chrome.com/docs/performance/insights/network-dependency-tree) by reducing the length of chains, reducing the download size of resources, or deferring the download of unnecessary resources to improve page load.
    relevant trace bounds: {min: 11789317907µs, max: 11789331851µs}
    example question: How do I optimize my network dependency tree?
  - insight name: ImageDelivery
    description: Reducing the download time of images can improve the perceived load time of the page and LCP. [Learn more about optimizing image size](https://developer.chrome.com/docs/performance/insights/image-delivery).
    relevant trace bounds: {min: 11789354487µs, max: 11789369749µs}
    estimated metric savings: FCP 0 ms, LCP 0 ms
    estimated wasted bytes: 379.3 kB
    example question: What should I do to improve and optimize the time taken to fetch and display images on the page?
    example question: Are all images on my site optimized?
  - insight name: DocumentLatency
    description: Your first network request is the most important. [Reduce its latency](https://developer.chrome.com/docs/performance/insights/document-latency) by avoiding redirects, ensuring a fast server response, and enabling text compression.
    relevant trace bounds: {min: 11789317907µs, max: 11789331851µs}
    estimated metric savings: FCP 0 ms, LCP 0 ms
    estimated wasted bytes: 52.2 kB
    example question: How do I decrease the initial loading time of my page?
    example question: Did anything slow down the request for this document?
  - insight name: Cache
    description: A long cache lifetime can speed up repeat visits to your page. [Learn more about caching](https://developer.chrome.com/docs/performance/insights/cache).
    relevant trace bounds: {min: 11789323200µs, max: 11789401985µs}
    estimated metric savings: FCP 0 ms, LCP 0 ms
    estimated wasted bytes: 1.2 MB
    example question: What caching strategies can I apply to improve my page performance?
  - insight name: LegacyJavaScript
    description: Polyfills and transforms enable older browsers to use new JavaScript features. However, many aren’t necessary for modern browsers. Consider modifying your JavaScript build process to not transpile [Baseline](https://web.dev/articles/baseline-and-polyfills) features, unless you know you must support older browsers. [Learn why most sites can deploy ES6+ code without transpiling](https://developer.chrome.com/docs/performance/insights/legacy-javascript).
    relevant trace bounds: {min: 11789323400µs, max: 11789355036µs}
    estimated metric savings: FCP 0 ms, LCP 0 ms
    estimated wasted bytes: 43.8 kB
    example question: Is my site polyfilling modern JavaScript features?
    example question: How can I reduce the amount of legacy JavaScript on my page?



## mobileTrace

The performance trace has been stopped.
Emulating network conditions: Slow 4G
Default navigation timeout set to 100000 ms
Emulating viewport: {"deviceScaleFactor":3,"isMobile":true,"hasTouch":true,"isLandscape":false,"width":390,"height":844}
Emulating CPU throttling: 4x slowdown
Emulating color scheme: light
## Summary of Performance trace findings:
URL: http://localhost:4391/en/profile/2026/
Trace bounds: {min: 11852520315µs, max: 11864663496µs}
CPU throttling: 4x
Network throttling: Slow 4G

# Available insight sets

The following is a list of insight sets. An insight set covers a specific part of the trace, split by navigations. The insights within each insight set are specific to that part of the trace. Be sure to consider the insight set id and bounds when calling functions. If no specific insight set or navigation is mentioned, assume the user is referring to the first one.

## insight set id: NAVIGATION_0

URL: http://localhost:4391/en/profile/2026/
Bounds: {min: 11852521332µs, max: 11864663496µs}
Metrics (lab / observed):
  - LCP: 2980 ms, event: (eventKey: r-11299, ts: 11855501027), nodeId: 57
  - LCP breakdown:
    - TTFB: 1 ms, bounds: {min: 11852521332µs, max: 11852522659.999998µs}
    - Load delay: 639 ms, bounds: {min: 11852522659.999998µs, max: 11853161880µs}
    - Load duration: 2,299 ms, bounds: {min: 11853161880µs, max: 11855460675µs}
    - Render delay: 40 ms, bounds: {min: 11855460675µs, max: 11855501027µs}
  - CLS: 0.00
Metrics (field / real users): n/a – no data for this page in CrUX
Available insights:
  - insight name: LCPBreakdown
    description: Each [subpart has specific improvement strategies](https://developer.chrome.com/docs/performance/insights/lcp-breakdown). Ideally, most of the LCP time should be spent on loading the resources, not within delays.
    relevant trace bounds: {min: 11852521332µs, max: 11855501027µs}
    example question: Help me optimize my LCP score
    example question: Which LCP subpart was most problematic?
    example question: What can I do to reduce the LCP time for this page load?
  - insight name: LCPDiscovery
    description: [Optimize LCP](https://developer.chrome.com/docs/performance/insights/lcp-discovery) by making the LCP image discoverable from the HTML immediately, and avoiding lazy-loading.
    relevant trace bounds: {min: 11852522659.999998µs, max: 11855461311µs}
    example question: Suggest fixes to reduce my LCP
    example question: What can I do to reduce my LCP discovery time?
    example question: Why is LCP discovery time important?
  - insight name: RenderBlocking
    description: Requests are blocking the page’s initial render, which may delay LCP. [Deferring or inlining](https://developer.chrome.com/docs/performance/insights/render-blocking) can move these network requests out of the critical path.
    relevant trace bounds: {min: 11853161998µs, max: 11855230443µs}
    estimated metric savings: FCP 1757 ms, LCP 0 ms
    example question: Show me the most impactful render-blocking requests that I should focus on
    example question: How can I reduce the number of render-blocking requests?
  - insight name: NetworkDependencyTree
    description: [Avoid chaining critical requests](https://developer.chrome.com/docs/performance/insights/network-dependency-tree) by reducing the length of chains, reducing the download size of resources, or deferring the download of unnecessary resources to improve page load.
    relevant trace bounds: {min: 11852521504µs, max: 11855230443µs}
    example question: How do I optimize my network dependency tree?
  - insight name: ImageDelivery
    description: Reducing the download time of images can improve the perceived load time of the page and LCP. [Learn more about optimizing image size](https://developer.chrome.com/docs/performance/insights/image-delivery).
    relevant trace bounds: {min: 11853161880µs, max: 11861662193µs}
    estimated metric savings: FCP 0 ms, LCP 0 ms
    estimated wasted bytes: 431.5 kB
    example question: What should I do to improve and optimize the time taken to fetch and display images on the page?
    example question: Are all images on my site optimized?
  - insight name: DocumentLatency
    description: Your first network request is the most important. [Reduce its latency](https://developer.chrome.com/docs/performance/insights/document-latency) by avoiding redirects, ensuring a fast server response, and enabling text compression.
    relevant trace bounds: {min: 11852521504µs, max: 11855103989µs}
    estimated metric savings: FCP 0 ms, LCP 0 ms
    estimated wasted bytes: 52.2 kB
    example question: How do I decrease the initial loading time of my page?
    example question: Did anything slow down the request for this document?
  - insight name: Cache
    description: A long cache lifetime can speed up repeat visits to your page. [Learn more about caching](https://developer.chrome.com/docs/performance/insights/cache).
    relevant trace bounds: {min: 11853161880µs, max: 11861662193µs}
    estimated metric savings: FCP 0 ms, LCP 0 ms
    estimated wasted bytes: 1.1 MB
    example question: What caching strategies can I apply to improve my page performance?
  - insight name: LegacyJavaScript
    description: Polyfills and transforms enable older browsers to use new JavaScript features. However, many aren’t necessary for modern browsers. Consider modifying your JavaScript build process to not transpile [Baseline](https://web.dev/articles/baseline-and-polyfills) features, unless you know you must support older browsers. [Learn why most sites can deploy ES6+ code without transpiling](https://developer.chrome.com/docs/performance/insights/legacy-javascript).
    relevant trace bounds: {min: 11853162950µs, max: 11859354853µs}
    estimated metric savings: FCP 0 ms, LCP 0 ms
    estimated wasted bytes: 43.8 kB
    example question: Is my site polyfilling modern JavaScript features?
    example question: How can I reduce the amount of legacy JavaScript on my page?



## interactionTrace

The performance trace has been stopped.
Emulating network conditions: Slow 4G
Default navigation timeout set to 100000 ms
Emulating viewport: {"deviceScaleFactor":3,"isMobile":true,"hasTouch":true,"isLandscape":false,"width":390,"height":844}
Emulating CPU throttling: 4x slowdown
Emulating color scheme: light
## Summary of Performance trace findings:
URL: http://localhost:4391/en/profile/2026/
Trace bounds: {min: 12279376944µs, max: 12293561329µs}
CPU throttling: 4x
Network throttling: Slow 4G

# Available insight sets

The following is a list of insight sets. An insight set covers a specific part of the trace, split by navigations. The insights within each insight set are specific to that part of the trace. Be sure to consider the insight set id and bounds when calling functions. If no specific insight set or navigation is mentioned, assume the user is referring to the first one.

## insight set id: NO_NAVIGATION

URL: http://localhost:4391/en/profile/2026/
Bounds: {min: 12279376944µs, max: 12293561329µs}
Metrics (lab / observed):
  - INP: 209 ms, event: (eventKey: s-15856, ts: 12281259805)
  - CLS: 0.00
Metrics (field / real users): n/a – no data for this page in CrUX
Available insights:
  - insight name: INPBreakdown
    description: Start investigating [how to improve INP](https://developer.chrome.com/docs/performance/insights/inp-breakdown) by looking at the longest subpart.
    relevant trace bounds: {min: 12281259805µs, max: 12281468404µs}
    example question: Suggest fixes for my longest interaction
    example question: Why is a large INP score problematic?
    example question: What's the biggest contributor to my longest interaction?



## ImageDelivery

Emulating network conditions: Slow 4G
Default navigation timeout set to 100000 ms
Emulating viewport: {"deviceScaleFactor":3,"isMobile":true,"hasTouch":true,"isLandscape":false,"width":390,"height":844}
Emulating CPU throttling: 4x slowdown
Emulating color scheme: light
## Insight Title: Improve image delivery

## Insight Summary:
This insight identifies unoptimized images that are downloaded at a much higher resolution than they are displayed. Properly sizing and compressing these assets will decrease their download time, directly improving the perceived page load time and LCP

## Detailed analysis:
Total potential savings: 431.5 kB

The following images could be optimized:

### http://localhost:4391/profile/2026/brands/viewsonic-logo.png (eventKey: s-10124, ts: 11855313152)
- Potential savings: 155.1 kB
- Optimizations:
Using a modern image format (WebP, AVIF) or increasing the image compression could improve this image’s download size. (Est 127.8 kB)
This image file is larger than it needs to be (458x378) for its displayed dimensions (107x88). Use responsive images to reduce the image download size. (Est 148.1 kB)

### http://localhost:4391/profile/2026/brands/foodpanda-logo.png (eventKey: s-10118, ts: 11855313139)
- Potential savings: 87.6 kB
- Optimizations:
Using a modern image format (WebP, AVIF) or increasing the image compression could improve this image’s download size. (Est 54.5 kB)
This image file is larger than it needs to be (518x403) for its displayed dimensions (113x88). Use responsive images to reduce the image download size. (Est 85 kB)

### http://localhost:4391/profile/2026/hero.webp (eventKey: s-2861, ts: 11853161880)
- Potential savings: 59.3 kB
- Optimizations:
This image file is larger than it needs to be (1122x1231) for its displayed dimensions (533x666). Use responsive images to reduce the image download size. (Est 59.3 kB)

### http://localhost:4391/profile/2026/brands/swag-logo.png (eventKey: s-10111, ts: 11855313122)
- Potential savings: 54 kB
- Optimizations:
Using a modern image format (WebP, AVIF) or increasing the image compression could improve this image’s download size. (Est 33.7 kB)
This image file is larger than it needs to be (504x258) for its displayed dimensions (128x66). Use responsive images to reduce the image download size. (Est 51.8 kB)

### http://localhost:4391/profile/2026/brands/momo-logo.png (eventKey: s-10105, ts: 11855313102)
- Potential savings: 42.3 kB
- Optimizations:
Using a modern image format (WebP, AVIF) or increasing the image compression could improve this image’s download size. (Est 21 kB)
This image file is larger than it needs to be (558x242) for its displayed dimensions (128x56). Use responsive images to reduce the image download size. (Est 41.2 kB)

### http://localhost:4391/profile/2026/hero-tag.en.webp (eventKey: s-10100, ts: 11855312588)
- Potential savings: 33.2 kB
- Optimizations:
This image file is larger than it needs to be (580x435) for its displayed dimensions (187x140). Use responsive images to reduce the image download size. (Est 33.2 kB)

## Estimated savings: FCP 0 ms, LCP 0 ms

## External resources:
- https://developer.chrome.com/docs/performance/insights/image-delivery
- https://developer.chrome.com/docs/lighthouse/performance/uses-optimized-images/

## LCPDiscovery

Emulating network conditions: Slow 4G
Default navigation timeout set to 100000 ms
Emulating viewport: {"deviceScaleFactor":3,"isMobile":true,"hasTouch":true,"isLandscape":false,"width":390,"height":844}
Emulating CPU throttling: 4x slowdown
Emulating color scheme: light
## Insight Title: LCP request discovery

## Insight Summary:
This insight analyzes the time taken to discover the LCP resource and request it on the network. It only applies if the LCP element was a resource like an image that has to be fetched over the network. There are 3 checks this insight makes:
1. Did the resource have `fetchpriority=high` applied?
2. Was the resource discoverable in the initial document, rather than injected from a script or stylesheet?
3. The resource was not lazy loaded as this can delay the browser loading the resource.

It is important that all of these checks pass to minimize the delay between the initial page load and the LCP resource being loaded.

## Detailed analysis:
The Largest Contentful Paint (LCP) time for this navigation was 2,980 ms.
The LCP element (IMG class='profile-2026-hero_portrait__PdMoI', nodeId: 57) is an image fetched from http://localhost:4391/profile/2026/hero.webp (eventKey: s-2861, ts: 11853161880).
## LCP resource network request: http://localhost:4391/profile/2026/hero.webp
eventKey: s-2861
Timings:
- Queued at: 641 ms
- Request sent at: 641 ms
- Download complete at: 2,939 ms
- Main thread processing completed at: 2,940 ms
Durations:
- Download time: 1,699 ms
- Main thread processing time: 0.6 ms
- Total duration: 2,299 ms
Initiator: http://localhost:4391/en/profile/2026/
Redirects: no redirects
Status code: 200
MIME Type: image/webp
Protocol: http/1.1
Initial priority: Low
Final priority: High
Render-blocking: No
From a service worker: No
Initiators (root request to the request that directly loaded this one): http://localhost:4391/en/profile/2026/
Response headers
- Transfer-Encoding: chunked
- Date: Mon, 21 Sep 2026 15:34:34 GMT
- Content-Type: image/webp

The result of the checks for this insight are:
- fetchpriority=high should be applied to the image preload request: FAILED
- LCP resources shouldn’t use loading=lazy: PASSED
- Request is discoverable in initial document: PASSED

## Estimated savings: none

## External resources:
- https://developer.chrome.com/docs/performance/insights/lcp-discovery
- https://web.dev/articles/lcp
- https://web.dev/articles/optimize-lcp

## RenderBlocking

Emulating network conditions: Slow 4G
Default navigation timeout set to 100000 ms
Emulating viewport: {"deviceScaleFactor":3,"isMobile":true,"hasTouch":true,"isLandscape":false,"width":390,"height":844}
Emulating CPU throttling: 4x slowdown
Emulating color scheme: light
## Insight Title: Render-blocking requests

## Insight Summary:
This insight identifies network requests that were render-blocking. Render-blocking requests are impactful because they are deemed critical to the page and therefore the browser stops rendering the page until it has dealt with these resources. For this insight make sure you fully inspect the details of each render-blocking network request and prioritize your suggestions to the user based on the impact of each render-blocking request.

## Detailed analysis:
Here is a list of the network requests that were render-blocking on this page and their duration:


Network requests data:



allUrls = [0: http://localhost:4391/_next/static/css/c9ec964725be903d.css, 1: http://localhost:4391/en/profile/2026/, 2: http://localhost:4391/_next/static/css/daf5e35a6472e154.css, 3: http://localhost:4391/_next/static/css/c2ab762e7fb519d4.css, 4: https://fonts.googleapis.com/css2?family=Unica+One&display=swap]

0;s-2876;641 ms;1,340 ms;2,708 ms;2,709 ms;2,068 ms;767 ms;1 ms;200;text/css;VeryHigh;VeryHigh;VeryHigh;t;http/1.1;f;1;[];[Transfer-Encoding: chunked|Date: Mon, 21 Sep 2026 15:34:35 GMT|Content-Type: text/css; charset=utf-8]
2;s-2890;641 ms;1,683 ms;2,482 ms;2,482 ms;1,841 ms;191 ms;0.4 ms;200;text/css;VeryHigh;VeryHigh;VeryHigh;t;http/1.1;f;1;[];[Transfer-Encoding: chunked|Date: Mon, 21 Sep 2026 15:34:35 GMT|Content-Type: text/css; charset=utf-8]
3;s-2874;641 ms;957 ms;1,683 ms;1,683 ms;1,042 ms;125 ms;0.2 ms;200;text/css;VeryHigh;VeryHigh;VeryHigh;t;http/1.1;f;1;[];[Transfer-Encoding: chunked|Date: Mon, 21 Sep 2026 15:34:35 GMT|Content-Type: text/css; charset=utf-8]
4;s-3154;683 ms;684 ms;684 ms;685 ms;1 ms;94 μs;0.8 ms;200;text/css;VeryHigh;VeryHigh;VeryHigh;t;h2;f;1;[];[content-encoding: gzip|x-content-type-options: nosniff|expires: Mon, 21 Sep 2026 15:32:52 GMT|alt-svc: h3=":443"; ma=2592000,h3-29=":443"; ma=2592000|date: Mon, 21 Sep 2026 15:32:52 GMT|content-type: text/css; charset=utf-8|vary: Sec-Fetch-Dest, Sec-Fetch-Mode, Sec-Fetch-Site|last-modified: Mon, 21 Sep 2026 15:32:52 GMT|x-frame-options: SAMEORIGIN|link: <https://fonts.gstatic.com>; rel=preconnect; crossorigin|cache-control: private, max-age=86400, stale-while-revalidate=604800|timing-allow-origin: *|cross-origin-opener-policy: <redacted>|cross-origin-resource-policy: <redacted>|access-control-allow-origin: *|x-xss-protection: 0|server: ESF]

## Estimated savings: FCP 1757 ms, LCP 0 ms

## External resources:
- https://developer.chrome.com/docs/performance/insights/render-blocking
- https://web.dev/articles/lcp
- https://web.dev/articles/optimize-lcp

## INPBreakdown

Emulating network conditions: Slow 4G
Default navigation timeout set to 100000 ms
Emulating viewport: {"deviceScaleFactor":3,"isMobile":true,"hasTouch":true,"isLandscape":false,"width":390,"height":844}
Emulating CPU throttling: 4x slowdown
Emulating color scheme: light
## Insight Title: INP breakdown

## Insight Summary:
Interaction to Next Paint (INP) is a metric that tracks the responsiveness of the page when the user interacts with it. INP is a Core Web Vital and the thresholds for how we categorize a score are:
- Good: 200 milliseconds or less.
- Needs improvement: more than 200 milliseconds and 500 milliseconds or less.
- Bad: over 500 milliseconds.

For a given slow interaction, we can break it down into 3 subparts:
1. Input delay: starts when the user initiates an interaction with the page, and ends when the event callbacks for the interaction begin to run.
2. Processing duration: the time it takes for the event callbacks to run to completion.
3. Presentation delay: the time it takes for the browser to present the next frame which contains the visual result of the interaction.

The sum of these three subparts is the total latency. It is important to optimize each of these subparts to ensure interactions take as little time as possible. Focusing on the subpart that has the largest score is a good way to start optimizing.

## Detailed analysis:
The longest interaction on the page was a `pointerdown` which had a total duration of `209 ms`. The timings of each of the three subparts were:

1. Input delay: 8 ms
2. Processing duration: 16 ms
3. Presentation delay: 185 ms.

## Estimated savings: none

## External resources:
- https://developer.chrome.com/docs/performance/insights/inp-breakdown
- https://web.dev/articles/inp
- https://web.dev/explore/how-to-optimize-inp
- https://web.dev/articles/optimize-long-tasks
- https://web.dev/articles/avoid-large-complex-layouts-and-layout-thrashing
