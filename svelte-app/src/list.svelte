<script>
    let date2 = new Date("Oct 10, 2019, 23:59:59");
  let d = new Date("Dec 25, 2020, 23:59:59");
  let d3 = new Date("Dec 2, 2011, 23:05:10");
  let examples = [
    { title: "Lorem Ipsum", date: d },
    { title: "Highschool Lunches", date: date2 },
    { title: "Bionicle Comeback", date: d3}
  ];
  let months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ];
  let dayEnds = [
    'st',
    'nd',
    'rd',
    'th'
  ];
  let now = new Date().getTime();
  setInterval(function(){
    now +=1000;
  }, 1000);
</script>

<ul class="examples">
    {#each examples as ex}
      <li class="capsule">
        <p class="capsule-item">{ex.title}</p>
        <p class="capsule-item">
        {#if ex.date.getTime() - now > 0}
        {Math.floor((ex.date.getTime() - now) / 86400000)}d 
        {Math.floor((ex.date.getTime() - now) % 86400000 / 3600000)}h
        {Math.floor((ex.date.getTime() - now) % 3600000 / 60000)}m
        {Math.floor((ex.date.getTime() - now) % 60000 / 1000)}s
        {:else}
        Ready!
        {/if}</p>
        <p class="capsule-item-time">
        {months[ex.date.getMonth()]}, 
        {ex.date.getDate()}{ex.date.getDate() > 3 ? dayEnds[3]: dayEnds[ex.date.getDate() - 1]}, 
        {ex.date.getFullYear()}, 
        {ex.date.getHours().toString().padStart(2, '0')}:{ex.date.getMinutes().toString().padStart(2, '0')}:{ex.date.getSeconds().toString().padStart(2, '0')}
        </p>
      </li>
    {/each}
  </ul>
<style>
  .examples {
      display: flex;
      justify-content: center;
      align-items: center;
      align-content: space-between;
      flex-direction: column;
      padding: 50px;
    }
    .capsule {
      display: flex;
      justify-content: center;
      width: 300px;
      height: 150px;
      border-radius: 80px;
      margin: 8px;
      flex-direction: column;
      background-color: #ce2d4f;
    }
    .capsule-item {
      align-self: center;
      color: white;
      font-size: 1.8em;
    }
    .capsule-item-time{
      font-size: 0.8em;
      align-self: center;
      color: white;
    }
    </style>