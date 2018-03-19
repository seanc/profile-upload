(function($) {
  $(function() {
    var $memberSelect = $('#member_select')
    var $profilePreview = $('.profile-picture-preview')

    $memberSelect.select2()
    $memberSelect.on('select2:select', e => {
      var member = e.params.data.id

      fetch(`/profiles/${member}.png`).then(res => {
        if (!res.ok) throw new Error('Resource not available')

        $profilePreview.css('background-image', `url(/profiles/${member}.png)`)
      }).catch(() => {
        $profilePreview.removeAttr('style')
      })
    })
  })
})(jQuery)
