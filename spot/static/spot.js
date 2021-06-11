document.addEventListener("DOMContentLoaded", function() {

    document.querySelectorAll(".next").forEach(btn => {
        btn.addEventListener("click", () => change_image(btn));
    });

    document.querySelectorAll(".prev").forEach(btn => {
        btn.addEventListener("click", () => change_image(btn=btn,next=false,prev=true));
    });

    if (document.getElementById("to-do-btn") instanceof Element) {
        document.getElementById("to-do-btn").onclick = () => {
            console.log("hi");
            document.getElementById("to-do").style.display = "block";
            document.getElementById("to-do-btn").style.display = "none";
            document.getElementById("exit-to-do").style.display = "block";
            document.getElementById("exit-to-do").onclick = () => {
                document.getElementById("to-do-btn").style.display = "block";
                document.getElementById("to-do").style.display = "none";
            }
        }
    }
    
    document.querySelectorAll('.task-checkbox').forEach(btn => {
        var parent = btn.parentNode.parentNode.parentNode;
        console.log(parent.classList);
        
        btn.addEventListener("click", () => {
            if (parent.classList.contains("white")) {
                parent.classList.remove('white');
                parent.classList.add('green');
                fetch(`/event/${btn.dataset.id}`, {
                    method: 'PUT',
                    body: JSON.stringify({
                        completed: true
                    })
                });
            } else if (parent.classList.contains("red")) {
                parent.classList.remove('red');
                parent.classList.add('green');
                fetch(`/event/${btn.dataset.id}`, {
                    method: 'PUT',
                    body: JSON.stringify({
                        completed: true
                    })
                });
            } else {
                parent.classList.remove('green');
                parent.classList.add('white');
                console.log(btn.dataset.id);
                fetch(`/event/${btn.dataset.id}`, {
                    method: 'PUT',
                    body: JSON.stringify({
                        completed: false
                    })
                });
            }
        })
    })

    document.querySelectorAll(".edit-task").forEach(btn => {
        btn.addEventListener("click", () => {
            const id = btn.dataset.id;
            document.getElementById(`task${id}`).style.display = "none";
            document.getElementById(`edit${id}`).style.display = "block";
            console.log(document.getElementById(`edit${id}-form`));

            document.getElementById(`edit${id}-form`).onsubmit = () => {

                const title = document.getElementById(`edit${id}-title`).value;
                const deadline = document.getElementById(`edit${id}-deadline`).value;

                fetch(`/event/${btn.dataset.id}`, {
                    method: 'POST',
                    body: JSON.stringify({
                        title: title,
                        deadline:deadline
                    })
                });
                return
            }
            
        });
    })

    // Drawing on canvas

    document.querySelectorAll(".sketch").forEach(div => {
        var canvas = div.childNodes[1];
        var ctx = canvas.getContext('2d');
        var sketch = div;
        var sketch_style = getComputedStyle(sketch);
        canvas.width = parseInt(sketch_style.getPropertyValue('width'));
        canvas.height = parseInt(sketch_style.getPropertyValue('height'));
    
        var mouse = {x: 0, y: 0};
        var last_mouse = {x: 0, y: 0};
    
        /* Mouse Capturing Work */
        canvas.addEventListener('pointermove', function(e) {
            last_mouse.x = mouse.x;
            last_mouse.y = mouse.y;
    
            mouse.x = e.pageX - this.offsetLeft;
            mouse.y = e.pageY - this.offsetTop;
        }, false);
    
    
        /* Drawing on Paint App */

        console.log("hi");

        document.querySelector(".draw").addEventListener("click", () => {
            console.log("draw");
            ctx.strokeStyle = "black";
        });
        document.querySelector(".erase").addEventListener("click", () => {
            console.log("erase");
            ctx.strokeStyle = "white";
        });
        document.querySelector(".clear").addEventListener("click", () => {
            console.log("clear");
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        });

        ctx.lineWidth = 3;
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        ctx.canvas.style.touchAction = "none";
        ctx.strokeStyle = "black";
    
        canvas.addEventListener('pointerdown', function(e) {
            canvas.addEventListener('pointermove', onPaint, false);
        }, false);
    
        canvas.addEventListener('pointerup', function() {
            canvas.removeEventListener('pointermove', onPaint, false);
        }, false);
    
        var onPaint = function() {
            ctx.beginPath();
            ctx.moveTo(last_mouse.x, last_mouse.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.closePath();
            ctx.stroke();
        };
    
    })
    
})

function change_image(btn, next=true, prev=false) {
    console.log(next,prev);
    var parent = document.getElementById(`${btn.dataset.parent}`);
    console.log(parent);

    const max = Number(parent.dataset.max);
    var btn_num = Number(btn.parentNode.parentNode.dataset.num);

        parent.childNodes[1].childNodes.forEach(img => {
            if (img.id ===`img${btn.parentNode.parentNode.dataset.num}`) {
                console.log("hide",img);
                img.className = 'project-img';
            }
        });

        if (next) {
            var inc = 1;
        } else {
            var inc = -1;
        }
        if (btn_num < max && next || btn_num > 1 && prev) {
            btn_num += inc;
        } else {
            if (next) {btn_num = 1;}
            else {console.log("here");btn_num = 6;}
        }
        btn.parentNode.parentNode.dataset.num = btn_num;
        console.log(btn.parentNode.parentNode.dataset.num);

        parent.childNodes[1].childNodes.forEach(img => {
            if (img.id ===`img${btn.parentNode.parentNode.dataset.num}`) {
                img.className = 'visible';
            }
        });    
}