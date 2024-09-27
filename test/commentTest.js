import assert from 'assert';
import UmlManager from '../lib/manager';
import parse from '../lib/parse';
import { nullID } from '../lib/types/element';

describe('CommentTests', () => {
    it('parseCommentTest', async () => {
        const manager = new UmlManager();
        const data = {
            Comment: {
                id: 'T1J0hAryQORw9sMaNfgUwVDor7CD',
                annotatedElements: ['T1J0hAryQORw9sMaNfgUwVDor7eE'],
                body: "it's freestyle not freedom"
            },
            owner: 'l3mdRJ0ChhLsbOXcs1XT3M5IwCOD'
        }
        const ownerData = {
            Class: {
                id: 'l3mdRJ0ChhLsbOXcs1XT3M5IwCOD',
                ownedComments: ['T1J0hAryQORw9sMaNfgUwVDor7CD']
            }
        }
        const annotatedData = {
            Class: {
                id: 'T1J0hAryQORw9sMaNfgUwVDor7eE',
            }
        }
        const comment = await manager.parse(data);
        const clazz = await manager.parse(ownerData);
        const clazzToo = await manager.parse(annotatedData);
        assert.equal(comment.owner.id(), 'l3mdRJ0ChhLsbOXcs1XT3M5IwCOD');
        assert.equal(await comment.annotatedElements.front(), clazzToo);
        assert.equal(comment.body, "it's freestyle not freedom");
        assert.equal(await clazz.ownedComments.front(), comment);
    });
    it('emitCommentTest', () => {
        const manager = new UmlManager();
        const comment = manager.create('Comment');
        const clazz = manager.create('Class');
        const clazzToo = manager.create('Class');
        clazz.ownedComments.add(comment);
        comment.annotatedElements.add(clazzToo);
        comment.body = "it's freestyle not freedom";
        const commentEmit = comment.emit();
        assert.equal(JSON.stringify(commentEmit), JSON.stringify({
            Comment: {
                id: comment.id,
                body: "it's freestyle not freedom",
                annotatedElements: [
                    clazzToo.id
                ]
            },
            owner: clazz.id
        }));        
    });
    it('deleteCommentTest', async () => {
        const manager = new UmlManager();
        const comment = manager.create('Comment');
        const clazz = manager.create('Class');
        await clazz.ownedComments.add(comment);
        assert.equal(comment.owner.id(), clazz.id);
        assert.equal(clazz.ownedComments.size(), 1);
        await manager.delete(comment);
        assert.equal(comment.owner.id(), nullID());
        assert.equal(clazz.ownedComments.size(), 0);
    });
})
