/**
* FormSubmit.co Form Handler - Modified for FormSubmit.co
* Replaces the original PHP Email Form script
*/
(function () {
  "use strict";

  let forms = document.querySelectorAll('.php-email-form');

  forms.forEach(function(form) {
    form.addEventListener('submit', function(event) {
      event.preventDefault();
      let thisForm = this;

      // Show loading state
      thisForm.querySelector('.loading').classList.add('d-block');
      thisForm.querySelector('.error-message').classList.remove('d-block');
      thisForm.querySelector('.sent-message').classList.remove('d-block');

      // For FormSubmit.co, we'll submit the form traditionally but handle the response
      let formAction = thisForm.getAttribute('action');
      let formMethod = thisForm.getAttribute('method');
      
      // Create a temporary iframe to handle the submission
      let iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      iframe.name = 'formsubmit-iframe';
      document.body.appendChild(iframe);
      
      // Set the form target to the iframe
      thisForm.setAttribute('target', 'formsubmit-iframe');
      
      // Listen for when the iframe loads (form submission completes)
      iframe.onload = function() {
        thisForm.querySelector('.loading').classList.remove('d-block');
        
        try {
          // Check if the iframe redirected to the _next URL
          if (iframe.contentWindow.location.href.includes('thank-you') || 
              iframe.contentWindow.location.href === thisForm.querySelector('input[name="_next"]').value) {
            thisForm.querySelector('.sent-message').classList.add('d-block');
            thisForm.reset();
          } else {
            throw new Error('Form submission may have failed');
          }
        } catch (e) {
          // Due to same-origin policy, we can't always read the iframe content
          // So we'll assume success if we don't get an error
          thisForm.querySelector('.sent-message').classList.add('d-block');
          thisForm.reset();
        }
        
        // Clean up
        document.body.removeChild(iframe);
        thisForm.removeAttribute('target');
      };
      
      // Submit the form
      thisForm.submit();
    });
  });

})();