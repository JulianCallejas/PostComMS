
/**
 * @swagger
 * /api/posts:
 *   get:
 *     summary: Obtener todos los posts
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Número de página
 *     responses:
 *       200:
 *         description: Lista de posts
 *       401:
 *         description: No autorizado
 *   post:
 *     summary: Crear un nuevo post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *     responses:
 *       201:
 *         description: Post creado con éxito
 *       401:
 *         description: No autorizado
 */

/**
 * @swagger
 * /api/posts/{postId}:
 *   put:
 *     summary: Actualizar un post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *     responses:
 *       200:
 *         description: Post actualizado con éxito
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Post no encontrado
 */

/**
 * @swagger
 * /api/posts/{postId}/like:
 *   post:
 *     summary: Dar me gusta o quitar me gusta de un post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Post con me gusta/quitar me gusta realizado con éxito
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Post no encontrado
 */
