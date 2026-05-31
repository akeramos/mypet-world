async function loadCounter() {

    try {

        const db = firebase.firestore();

        const counterRef =
            db.collection("stats")
              .doc("pageViews");

        await counterRef.update({
            count: firebase.firestore.FieldValue.increment(1)
        });

        const snapshot = await counterRef.get();

        if (!snapshot.exists) {
            console.error("Counter document not found");
            return;
        }

        const liveCount = snapshot.data().count || 70142;

        const tickerContainer =
            document.getElementById('liveEcosystemTicker');

        if (!tickerContainer) {
            console.error("Ticker container not found");
            return;
        }

        const formattedStr =
            liveCount.toLocaleString('en-US');

        let generatedHTML = '';

        for (const char of formattedStr) {

            if (char === ',') {

                generatedHTML +=
                    '<span class="ticker-comma">,</span>';

            } else {

                generatedHTML += `
                    <span class="ticker-digit">
                        <span>${char}</span>
                    </span>
                `;
            }
        }

        tickerContainer.innerHTML = generatedHTML;

        console.log(
            "Firestore counter loaded:",
            liveCount
        );

    } catch (error) {

        console.error(
            "Firestore counter error:",
            error
        );
    }
}
