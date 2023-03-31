# VisUAM

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 13.1.1.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.

# VisUAM user documentation

# VisUAM Interface 

In Image 1, the VisUAM homepage is shown, accessed through the URL [VisUAM](http://palancar.izt.uam.mx:4010/)

Next, the different visual elements of VisUAM are explained, such as buttons, text boxes, etc.
```
1. VisUAM Logo: It is a link to the main page of VisUAM.
2. “Start” Button: This button is also a link to the main page of VisUAM.
3. “What is?” Button: It is a link that leads to a brief introduction of the viewer.
4. “Workgroup” Button: Shows a section with the different members of the project.
5. “Example” Button: It is a link to download a compressed folder in ZIP format which contains examples of files in .vsm format ready to be visualized in VisUAM.
6. Language selection button: allows selecting the website language (currently available in Spanish and English).
7. Open Viewer button: allows opening the viewer.
```
![image 1.](https://github.com/jluisquf/VisUAM/blob/master/src/assets/img/homePage.jpg)

<sub>Image 1. Homepage. </sub>

When you click on the "Start Now" or "Open Viewer" button, the interface of the viewer is displayed (see Image 2).

![image 2.](https://github.com/jluisquf/VisUAM/blob/master/src/assets/img/Image2VisUAM.jpg)

<sub>Image 2. Page to open documents.</sub>

In this interface, we can observe two buttons:

```
7.- "Open Document" button: allows you to open the file explorer to load the .vsm file that you want to interpret/visualize.
8.- "Menu" button: displays a menu (which varies depending on the .vsm file loaded in the viewer), as shown in Image 3. If you click on the "Menu" button without loading a .vsm file, you can see that a welcome popup window opens and displays an "Open Document" button (see Image 4). 
```
![image 3.](https://github.com/jluisquf/VisUAM/blob/master/src/assets/img/Image3VisUAM.jpg)

<sub>Image 3. Example of the menu for Voronoi.</sub>

![image 4.](https://github.com/jluisquf/VisUAM/blob/master/src/assets/img/Image4VisUAM.jpg)

<sub>Image 4. Menu button without loading a VSM file.</sub>

# Manual for Visualization

This section describes how to perform a visualization using VisUAM.

![GoToVisUAM](https://github.com/jluisquf/VisUAM/blob/master/src/assets/img/GoToVisUAM.JPG)
![OpenVIew](https://github.com/jluisquf/VisUAM/blob/master/src/assets/img/OpenView.JPG)
![VSMFile](https://github.com/jluisquf/VisUAM/blob/master/src/assets/img/VSMFile.JPG)
![ReadyView](https://github.com/jluisquf/VisUAM/blob/master/src/assets/img/ReadyView.JPG)

# VisUAM Formats

Currently, VisUAM supports 4 types of visualization:
```
- 2D Graphics.
- Porous networks.
- Voronoi diagrams.
- Particle diffusion.
```
VisUAM can recognize input data for different applications (different visual elements) as long as they follow the basic structure of the VSM format, which is shown in Image 5.

![image 5.](https://github.com/jluisquf/VisUAM/blob/master/src/assets/img/Image5VisUAM.jpg)

<sub>Image 5. Base format (VSM).</sub>

Every VSM file must have the "name" property (tag) since VisUAM recognizes supported formats based on this tag.
Each supported format may have its own properties (tags) specific to the application. The following will describe each of the formats and their properties.

## 2D Graphics (Chart2D)

In Image 6, we can see an example of the contents of a VSM file to generate 2D graphics. To describe it, we will use tags in red to indicate the meaning of each of its components.

![image 6.](https://github.com/jluisquf/VisUAM/blob/master/src/assets/img/Image6VisUAM.jpg)

<sub>Image 6. 2D Graphics format.</sub>
```
Label / Description
1. Format name, in this case, we use "Chart2D".
2. Chart type, which can take the values of: bars, lines, points, pie.
3. Graphic title.
4. X axis title.
5. Y axis title.
6. X axis labels (must be separated by commas).
7. Data to be plotted (data must be inside square brackets, each series is separated by braces and a comma at the end of each brace).
8. Title of each data series (dataset).
9. Y axis labels (must be separated by commas).
```

In Image 7, we can see the visualization of an example of 2D Graphics.

![image 7.](https://github.com/jluisquf/VisUAM/blob/master/src/assets/img/Image7VisUAM.jpg)

<sub>Image 7. Visualization of 2D Graphics.</sub>

Clicking on the Menu button will give us the options shown in Image 8.

![image 8.](https://github.com/jluisquf/VisUAM/blob/master/src/assets/img/Image8VisUAM.jpg)

<sub>Image 8. Menu for 2D Graphics.</sub>
```
Label / Description
1. It allows us to select the type of plot to visualize. Currently, the options are: bars, points, lines, and pie.
2. Hide the Y-axis.
3. Hide all the data related to dataset 0. Each dataset has a switch to show or hide its data.
4. Close the graphic visualization.
```
## Porous Networks (PoreNetwork)

In Image 6, we can see an example of the content of the VSM file to generate a porous network. To describe it, we will use labels in red to indicate the meaning of each of the elements that compose it.

![image 9.](https://github.com/jluisquf/VisUAM/blob/master/src/assets/img/Image9VisUAM.jpg)

<sub>Image 9 - Porous Network Format.</sub>
```
Label / Description
1. Format name, in this case we use "Pore Network".
2. The size (in cubic dimension) of the network.
3. Represents the set of spheres (sites) that make up the porous network.
4. This element represents the X coordinate of the sphere.
5. This element represents the Y coordinate of the sphere.
6. This element represents the Z coordinate of the sphere.
7. Radius of each sphere.
8. Color of the sphere.
9. This represents the set of links that connect sites that make up the porous network.
10. X coordinate of the site.
11. Y coordinate of the site.
12. Z coordinate of the site.
13. Radius of the link.
14. Color of the link.
```
In Image 10, we can observe the visualization of an example of porous networks.

![image 10.](https://github.com/jluisquf/VisUAM/blob/master/src/assets/img/Image10VisUAM.jpg)

<sub>Image 10. Visualization of a Pore Network</sub>

When clicking on the Menu button, we will have the options shown in Image 11.

![image 11.](https://github.com/jluisquf/VisUAM/blob/master/src/assets/img/Image11VisUAM.jpg)

<sub>Image 11. Menu for Porous Network.</sub>
```
Label
Description
1. Change the color of the Porous Net to a scale of Blue
2. Changes the color of the porous network to a grayscale scale.
3. This option rotates the Porous Network automatically by 360 degrees.
4. Close the current visualization.
```
## Voronoi Diagrams (Voronoi)

In Image 12, we can observe an example of the contents of a VSM file to generate a Voronoi Diagram. To describe it, we will use red labels to indicate the meaning of each of its components.

![image 12.](https://github.com/jluisquf/VisUAM/blob/master/src/assets/img/Image12VisUAM.jpg)

<sub>Image 12. Voronoi Diagram Format.</sub>

```
Label / Description
1. Format name, in this case we use "Voronoi".
2. Dimensiones que tendrá el diagrama. Puede tomar los valores 2D o 3D.
3. Size (radius) of the visualization axes (it consists of a tuple that depends on the dimension of the diagram).
4. Size of the X-axis.
5. Size of the Y-axis.
6. Size of the Z-axis.
7. Set of points of the Voronoi diagram to be visualized.
8. Coordinates of the point (dependent on the visualization) and the color assigned to that point.
```
In Image 12, we can see the visualization of an example of a 3D Voronoi diagram.

![image 13.](https://github.com/jluisquf/VisUAM/blob/master/src/assets/img/Image13VisUAM.jpg)

<sub>Image 13. Visualization of 3D Voronoi diagram</sub>

When you click on the Menu button, you will see the options shown in Image 14.

![image 14.](https://github.com/jluisquf/VisUAM/blob/master/src/assets/img/Image14VisUAM.jpg)

<sub>Image 14. 3D Voronoi diagram menu.</sub>
```
Label / Description
1. Allows us to change the color of the Voronoi diagram to blue.
2. It allows us to change the color of the Voronoi diagram to gray.
3. Automatically rotates the Voronoi diagram.
4. Close the graph visualization.
```
## Particle Diffusion(Particles)

To visualize the particle diffusion animation, it is necessary to have the following structure in the VSM file. In Image 15, we can observe the basic structure for the animation. As we can see, it includes the name tag, the type of animation, as well as two tags referring to the direction of the flow in which diffusion takes place.

![image 15.](https://github.com/jluisquf/VisUAM/blob/master/src/assets/img/Image15VisUAM.jpg)

<sub>Image 15. Particle Diffusion Format.</sub>
```
Label / Description
1. Name of the format, in this case we use "Particles".
2. Dimension of the channel in which the particles diffuse.
3. Diffusion Flow Labels, there must be 2:
- NtoW:  Diffusion from the narrowest to the widest part of the channel.
- WtoN:  Diffusion from the widest to the narrowest part of the channel.
Each of these labels has a sub-label from 4 to 18.
```
![image 16.](https://github.com/jluisquf/VisUAM/blob/master/src/assets/img/Image16VisUAM.jpg)

<sub>Image 16. Particle Diffusion Format.</sub>
```
Label / Description
4. It contains information about where the particle diffusion takes place and is composed of a set of walls that define the shape of the channel. Each wall of the channel must have a name and its associated information. In this format, conical channels with 4 linear walls are considered.
5, 8, 9, 10. These are the names of the walls of the channel in this case:
- TWall
- BWall
- LBarrier
- RBarrier
Each of these walls must contain labels 6 and 7.
6. Function responsible for shaping the channel.
7. Determines if the canal wall has reflective properties (true) or not (false).
11. Set of particles to draw.
12. Particle type.
13. Quantity of particles to be shown in the animation.
14. Information of a particle, each of which must contain the following information:
- id  Particle identifier.
- steps represents the displacement that each particle will have during the animation.
- lastTouch It represents the last time the particle touches the wall from which it started its displacement.
15. Information regarding the number of times particles hit the reflecting walls.
16. It is the information for each reflecting wall that contains the following fields:
- nameBarrier: Name of the reflective barrier.
- value: number of times the particle touches the wall.
17. They contain information regarding the times for the analysis of the trajectories.
The times of interest are:
- First-passing time
- Looping time
- Transition time
18. This is the information of each of the times and contains the following fields.:
- nameTime: Name of the time of interest.
- value:  value of the duration of time.
```
In Image 17, we can observe the visualization of an example of particle diffusion. By clicking on the menu button, we will have the options shown in Image 18.

![image 17.](https://github.com/jluisquf/VisUAM/blob/master/src/assets/img/Image17VisUAM.jpg)

<sub>Image 17. Visualization of particle diffusion.</sub>
  
By clicking on the menu button, we will have the options shown in Image 18.
  
![image 18.](https://github.com/jluisquf/VisUAM/blob/master/src/assets/img/Image18VisUAM.JPG)
  
<sub>Image 18. Particle diffusion menu.</sub>
```
Label / Description 
1. Delay the movement of the particles by one position
2. Pause the movement of the particles in one position.
3. Advance the movement of the particles by one position.
4. Show the trajectories that the particles follow.
5. Generate an individual visualization.
6. Button to select a particle and generate an individual visualization.
7. Statistics on the times related to trajectory analysis.
8. Statistics on the interactions of particles with the reflective walls of the channel.
9. Display the bar graph of the selected statistics (Times/Impacts).
```
The 2D graphs that can be generated on the statistics are shown in Image 19.

![image 19.](https://github.com/jluisquf/VisUAM/blob/master/src/assets/img/Image19VisUAM.JPG)

<sub>Image 19. Bar graph of statistical data from trajectory analysis.</sub>

# VisUAM Execution

The following explains the execution of the VisUAM project from the Visual Studio Code tool:
Preconditions:
- have installed NodeJS
- have installed npm
- have installed Angular
 
Download from the project link in Github (https://github.com/jluisquf/VisUAM.git) the project code, either through a git clone or by downloading the ZIP file, for this example we will obtain the project code by a git clone.

![image 20.](https://github.com/jluisquf/VisUAM/blob/master/src/assets/img/Image20VisUAM.JPG)

<sub>Image 20. Project on GitHub.</sub>

Download project in terminal (shell)
```
1. Copy the Project Link (Image 20)
2. Execute the command git clone <Project link> (Image 21). The “git clone” command downloads the Project to our computer.
3. Execute the command cd VisUAM. The “git clone” command generates the folder VisUAM.
```
![image 21.](https://github.com/jluisquf/VisUAM/blob/master/src/assets/img/Image21VisUAM.JPG)

<sub>Image 21. Terminal for running commands.</sub>

Downloading VisUAM dependencies from terminal
 
Once you have the project code you will proceed to download the dependencies with the following command:
```
npm i 
```
![image 22.](https://github.com/jluisquf/VisUAM/blob/master/src/assets/img/Image22VisUAM.JPG)

<sub>Image 22. Terminal for running commands.</sub>

Finally you will run the command ng serve to create a virtual server on your local machine and host it on port 4200 (image 23).

![image 23.](https://github.com/jluisquf/VisUAM/blob/master/src/assets/img/Image23VisUAM.JPG)

<sub>Image 23. Terminal for running commands.</sub>

And that's it! you will have our viewer running at the following local address: http://localhost:4200/visualizador

# VisUAM Compilation

The following explains the  process of compiling the VisUAM project from the Visual Studio Code tool:
 
Preconditions:
-have installed NodeJS
-have installed npm
-have installed Angular
Download from the project link in Github (https://github.com/jluisquf/VisUAM.git) the project code, either through a git clone or by downloading the ZIP file, for the example we will obtain the project code by a git clone.

![image 24.](https://github.com/jluisquf/VisUAM/blob/master/src/assets/img/Image20VisUAM.JPG)

<sub>Image 24. Project on GitHub.</sub>

Download the project from the repository found on github (image 24).
```
1. Copy the project link
```
![image 25.](https://github.com/jluisquf/VisUAM/blob/master/src/assets/img/Image25VisUAM.JPG)

<sub>Image 25. Terminal for running commands.</sub>

The “grit clone” command donwloads the project into our computer
```
2. Execute the command: “git clone [project link]”
```
![image 26.](https://github.com/jluisquf/VisUAM/blob/master/src/assets/img/Image26VisUAM.JPG)

<sub>Image 26. Terminal for running commands.</sub>
```
3. And we go to the folder generated by the previous command
```
Once you have the project code you will proceed to download the dependencies with the following command:
```
npm i 
```
 
Finally you will run the ng build command to compile our application which will be stored in the dist folder.

![image 27.](https://github.com/jluisquf/VisUAM/blob/master/src/assets/img/Image27VisUAM.JPG)

<sub>Image 27. Terminal for running commands.</sub>
```
1.-Executing the ng build command to build/compile the project
2.-Compiled project in the "dist" folder
```

# Running VisUAM using Docker

## create an image

docker build --tag visuam-docker .
- 	docker build, builds a Docker image from a Dockerfile and any other required files in the current directory.
- 	The --tag parameter is used to tag the image being built with a descriptive name, which in this case is visuam-docker. The tag is used to refer to the image in the future, for example, to start a container from it.
- 	The last argument of the command (.) specifies the build context, i.e., the directory where the Dockerfile and any other files required to build the image are located. In this case, the current directory (.) is used as the build context.
 
## Run the container
 
docker run -d -p 4010:80 --name=visuam visuam-docker:latest
- docker run is used to start a container from an existing image.
-	-d: This parameter starts the container in the background, i.e., in "detached" mode, detached from the current console. This means after starting the container, control of the console is returned to the user.
- 	-p 4010:80: This parameter specifies the port mapping between the container and the host. In this case, port 80 in the container is exposed on port 4010 of the host.
- 	--name=visuam: This parameter sets the name of the container to visuam.
- 	visuam-docker:latest: This is the name and tag of the image from which the container will be started. In this case, the visuam-docker image with the latest tag is used.







