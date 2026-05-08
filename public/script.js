// Replace with your actual Google Business Link
const googleReviewLink = "https://search.google.com/local/writereview?placeid=ChIJRYI0P6y5wjsRvnEaVMTLDlc";

document.getElementById('feedbackForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // UI Feedback: Change button text while loading
    const submitBtn = e.target.querySelector('button');
    submitBtn.innerText = "Generating...";
    submitBtn.disabled = true;

    const data = {
        branch: document.getElementById('branch').value,
        course: document.getElementById('course').value,
        teaching: document.querySelector('input[name="teaching"]:checked')?.value || "5",
        syllabus: document.querySelector('input[name="syllabus"]:checked')?.value || "5",
        satisfaction: document.querySelector('input[name="satisfaction"]:checked')?.value || "5"
    };

    try {
        const response = await fetch('/generate-review', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        const result = await response.json();
        
        // Show the review in the popup
        document.getElementById('generatedReview').innerText = result.review;
        document.getElementById('modal').style.display = 'block';

    } catch (error) {
        alert("System error: Make sure the backend server is running.");
        console.error(error);
    } finally {
        submitBtn.innerText = "Generate Review";
        submitBtn.disabled = false;
    }
});

// Close modal logic
document.getElementById('postBtn').addEventListener('click', async () => {
    const reviewText = document.getElementById('generatedReview').innerText;
    await navigator.clipboard.writeText(reviewText);
    alert("Copied to clipboard!");
    window.open(googleReviewLink, '_blank');
    document.getElementById('modal').style.display = 'none';
});
